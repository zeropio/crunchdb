import requests
import subprocess
import os
import shutil
import time
import psutil

def kill_git_processes():
    """Force kill any git processes that might be holding file locks"""
    try:
        for proc in psutil.process_iter(['pid', 'name']):
            try:
                if proc.info['name'] and any(name in proc.info['name'].lower() for name in ['git.exe', 'git']):
                    proc.kill()
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass
        time.sleep(1)
    except Exception:
        pass

def force_delete_folder(folder_path):
    """Aggressive folder deletion - go straight to the most effective method"""
    if not os.path.exists(folder_path):
        return True
        
    kill_git_processes()
    time.sleep(1)
    
    try:
        # Method 1: Direct rmdir (usually works)
        result = subprocess.run(f'rmdir /s /q "{folder_path}"', shell=True, capture_output=True)
        if not os.path.exists(folder_path):
            return True
    except:
        pass
    
    try:
        # Method 2: Take ownership and delete
        subprocess.run(f'icacls "{folder_path}" /grant Everyone:F /T /C', shell=True, capture_output=True)
        subprocess.run(f'rmdir /s /q "{folder_path}"', shell=True, capture_output=True)
        return not os.path.exists(folder_path)
    except:
        return False

def get_all_repositories():
    """Fetch ALL repositories from the GitHub organization with pagination"""
    api_url = "https://api.github.com/orgs/apple-oss-distributions/repos"
    
    params = {
        'sort': 'name',
        'direction': 'asc',
        'per_page': 100
    }
    
    all_repos = []
    page = 1
    
    print("Starting repository fetch...")
    
    while True:
        params['page'] = page
        try:
            print(f"Fetching page {page}...")
            response = requests.get(api_url, params=params, timeout=30)
            
            if response.status_code != 200:
                break
                
            repos = response.json()
            if not repos:
                break
                
            all_repos.extend([repo['clone_url'] for repo in repos])
            
            if len(repos) < 100:
                break
                
            page += 1
            time.sleep(1)
            
        except Exception:
            break
    
    print(f"Total repositories fetched: {len(all_repos)}")
    return all_repos

def clone_and_process_repository(clone_url, crunchfinder_path):
    """Clone a repository and run CrunchFinder on it"""
    repo_name = clone_url.split('/')[-1].replace('.git', '')
    
    print(f"\n🎯 Processing: {repo_name}")
    
    try:
        # Step 1: Clone repository with shallow clone
        print(f"📥 Cloning...")
        result = subprocess.run(['git', 'clone', '--depth', '1', clone_url], 
                              capture_output=True, text=True, timeout=300)
        
        if result.returncode != 0:
            print(f"❌ Clone failed")
            return False
        
        print("✅ Clone successful")
        
        # Step 2: Count files for verification
        file_count = sum(len(files) for _, _, files in os.walk(repo_name))
        print(f"📁 Files: {file_count}")
        
        # Step 3: Run CrunchFinder
        print(f"🔍 Running CrunchFinder...")
        output_file = f"{repo_name}.json"
        cmd = [crunchfinder_path, repo_name, '-r', '-O', output_file]
        
        result = subprocess.run(cmd, text=True, timeout=600)
        
        # Verify output
        if os.path.exists(output_file):
            size = os.path.getsize(output_file)
            print(f"💾 Output: {output_file} ({size} bytes)")
        else:
            print(f"❌ No output file")
        
        # Step 4: Aggressive cleanup (no retry loops)
        print(f"🧹 Cleaning up...")
        if force_delete_folder(repo_name):
            print("✅ Cleanup successful")
        else:
            print("⚠️ Folder might remain")
        
        return True
        
    except subprocess.TimeoutExpired:
        print(f"⏰ Timeout")
        force_delete_folder(repo_name)
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        force_delete_folder(repo_name)
        return False

def main():
    print("🚀 Starting AutoCrunch Script")
    print("=" * 50)
    
    # Install psutil if not available
    try:
        import psutil
    except ImportError:
        print("Installing psutil...")
        subprocess.run([sys.executable, "-m", "pip", "install", "psutil"], capture_output=True)
        import psutil
    
    # Path to CrunchFinder
    crunchfinder_path = r"D:\Code\CrunchFinder\target\debug\CrunchFinder.exe"
    
    if not os.path.exists(crunchfinder_path):
        print(f"❌ CrunchFinder not found")
        return
    
    print(f"🔧 CrunchFinder ready")
    
    # Get repositories
    print("\n📡 Fetching repositories...")
    repositories = get_all_repositories()
    
    if not repositories:
        print("❌ No repositories found")
        return
    
    print(f"📚 Found {len(repositories)} repositories")
    
    # Process repositories
    successful = 0
    for i, repo_url in enumerate(repositories, 1):
        print(f"\n{'='*40}")
        print(f"📦 {i}/{len(repositories)}: {repo_url.split('/')[-1]}")
        print(f"{'='*40}")
        
        if clone_and_process_repository(repo_url, crunchfinder_path):
            successful += 1
        
        # Short delay between repos
        if i < len(repositories):
            time.sleep(2)
    
    print(f"\n🎉 Completed! {successful}/{len(repositories)} successful")

if __name__ == "__main__":
    main()