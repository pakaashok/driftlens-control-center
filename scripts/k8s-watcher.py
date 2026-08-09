#!/usr/bin/env python3
"""
DriftLens - Kubernetes Watcher
Watches for K8s changes and auto-syncs to DriftLens
"""

import subprocess
import time
import json
import os
from datetime import datetime

NAMESPACES = ["development", "staging", "production"]
SYNC_SCRIPT = os.path.join(os.path.dirname(__file__), "sync-from-minikube.sh")
CHECK_INTERVAL = 10  # seconds

def get_k8s_state():
    """Get current state of all deployments."""
    state = {}
    for ns in NAMESPACES:
        try:
            result = subprocess.run(
                ["kubectl", "get", "deployment", "sample-app",
                 "-n", ns, "-o", "json"],
                capture_output=True, text=True
            )
            if result.returncode == 0:
                data = json.loads(result.stdout)
                state[ns] = {
                    "replicas": data["spec"]["replicas"],
                    "image": data["spec"]["template"]["spec"]["containers"][0]["image"],
                    "ready": data["status"].get("readyReplicas", 0)
                }
        except Exception as e:
            state[ns] = {"error": str(e)}
    return state

def sync_driftlens():
    """Run the sync script."""
    subprocess.run(["bash", SYNC_SCRIPT], check=True)

def print_state(state):
    """Print current state nicely."""
    print(f"\n📊 Current State ({datetime.now().strftime('%H:%M:%S')}):")
    for ns, info in state.items():
        if "error" not in info:
            print(f"  {ns:12} → replicas: {info['replicas']}, "
                  f"image: {info['image']}, "
                  f"ready: {info['ready']}")

def main():
    print("🔍 DriftLens K8s Watcher Started!")
    print(f"   Checking every {CHECK_INTERVAL} seconds...")
    print("   Press Ctrl+C to stop\n")

    last_state = {}

    while True:
        try:
            current_state = get_k8s_state()

            if current_state != last_state:
                print(f"\n🔔 Change detected!")
                print_state(current_state)

                # Show what changed
                for ns in NAMESPACES:
                    if ns in last_state and ns in current_state:
                        if last_state[ns] != current_state[ns]:
                            print(f"\n  Changed in {ns}:")
                            print(f"    Before: {last_state[ns]}")
                            print(f"    After:  {current_state[ns]}")

                print("\n🔄 Syncing DriftLens...")
                sync_driftlens()
                print("✅ Dashboard updated!")
                print(f"🌐 http://192.168.29.55:3000")

                last_state = current_state
            else:
                print(f"⏳ {datetime.now().strftime('%H:%M:%S')} "
                      f"No changes...", end="\r")

            time.sleep(CHECK_INTERVAL)

        except KeyboardInterrupt:
            print("\n\n👋 Watcher stopped!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")
            time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    main()
