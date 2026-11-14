# Missão 8: Servidor Web Apache no Debian 13 via Hyper-V

Documentação técnica de implantação, configuração de rede, controle de acesso e validação do servidor web Linux do Grupo 8 para o Projeto Integrador IV do curso de Ciência da Computação do Centro Universitário UNIFAGOC.

O projeto consiste no provisionamento de uma máquina virtual Debian GNU/Linux 13 operando exclusivamente em interface de linha de comando sobre o hipervisor Microsoft Hyper-V. O servidor hospeda a aplicação web institucional estática Toca & Cia através do daemon Apache HTTP Server, respondendo na sub-rede interna do laboratório `10.10.1.0/24` sob o endereço IPv4 fixo `10.10.1.60` e nome de domínio interno `web01.corp.local`.

---

## 1. Arquitetura e Tecnologias

A infraestrutura opera em ambiente de rede isolado, conectada ao comutador virtual interno do Microsoft Hyper-V. A resolução de nomes utiliza o servidor DNS e Active Directory mantido pela Colmeia 2 no endereço `10.10.1.10`, responsável pela zona autoritativa `corp.local` e pelo apontamento do registro Tipo A `web01.corp.local` para `10.10.1.60`. O roteamento de saída utiliza o gateway padrão `10.10.1.1`.

### Especificações do Ambiente

| Parâmetro | Especificação Técnica |
| :--- | :--- |
| **Hipervisor** | Microsoft Hyper-V Server |
| **Identificação da VM** | `G8-WEB` |
| **Hostname** | `web01` |
| **FQDN** | `web01.corp.local` |
| **Sistema Operacional** | Debian GNU/Linux 13 Trixie x86_64 |
| **Target de Inicialização** | `multi-user.target` sem subsistema gráfico |
| **Alocação de Recursos** | 2 vCPUs, 2 GB RAM, 20 GB VHDX |
| **Interface de Rede** | `eth0` em `vSwitch-Interno` |
| **Endereço IPv4** | `10.10.1.60/24` |
| **Máscara de Sub-rede** | `255.255.255.0` |
| **Gateway Padrão** | `10.10.1.1` |
| **Servidor DNS Interno** | `10.10.1.10` |
| **Loopback Local** | `127.0.0.1` |
| **Daemon HTTP** | Apache/2.4.69 |
| **Diretório de Publicação** | `/var/www/html/projeto_gx` |
| **Filtro de Pacotes** | UFW / Netfilter |

### Diagrama de Topologia

<img src="./03 - Tech Writer/topologia.png" width="550">

---

## 2. Organização da Equipe

A execução foi dividida em sete frentes técnicas com segregação de responsabilidades entre administração de sistemas, configuração do daemon HTTP, engenharia de segurança, desenvolvimento front-end, documentação de topologia, controle de qualidade e gerência de configuração.

<img src="./ROTEIRO OFICIAL COMPLETO MISSÃO 8 - SERVIDOR WEB APACHE - ATUALIZADO.png" width="550">

| Integrante | Função | Escopo Técnico |
| :--- | :--- | :--- |
| **Marcos Felipe** | SysAdmin | Provisionamento da VM no Hyper-V, instalação limpa do Debian 13 em CLI, configuração do GRUB, endereçamento IPv4 estático e regras do firewall UFW. |
| **Inácio José** | Especialista Apache | Instalação do pacote `apache2`, configuração e ativação do VirtualHost `projeto.conf`, transferência de artefatos e deploy em `/var/www/html/projeto_gx`. |
| **Lucas Luiz** | Tech Writer | Levantamento dos parâmetros de rede entre as colmeias e modelagem do diagrama técnico de topologia. |
| **Gustavo Pereira** | Dev Front-end | Codificação da aplicação estática Toca & Cia em HTML5, CSS3 e JavaScript, incluindo a seção obrigatória de Ficha Técnica. |
| **Luan Carlos** | SecOps | Hardening do Apache em `security.conf`, bloqueio de listagem de diretórios, aplicação de permissões `755` e `644`, rotação de logs no `logrotate` e auditoria de código-fonte. |
| **Miguel Almeida** | Analista de QA | Execução da bateria dos 9 testes de validação funcional, conectividade ICMP, resolução DNS, inspeção de sockets e persistência pós-reboot. |
| **Matheus Gonçalves** | Gerente de Documentação | Estruturação do roteiro técnico, controle de tarefas no Trello, homologação da infraestrutura e consolidação da documentação oficial. |

---

## 3. Procedimentos de Execução

### 3.1. Provisionamento da Máquina Virtual e Restrição ao Modo Texto

A máquina virtual foi instanciada no Hyper-V em Geração 2 e instalada a partir da imagem netinst do Debian 13 sem seleção de ambientes gráficos no `tasksel`.

<img src="./Atividade 01/maquina virtual.png" width="550">

Para impedir a inicialização de alocações gráficas após atualizações de sistema, o arquivo `/etc/default/grub` foi configurado para console de texto e o target padrão do `systemd` foi fixado em `multi-user.target`:

```bash
sudo systemctl set-default multi-user.target
sudo update-grub
```

<img src="./Atividade 01/etc-default-grub2.png" width="550">

### 3.2. Atualização de Pacotes e Kernel

Com o sistema base operante em `tty1`, foi executada a atualização dos pacotes instalados e da imagem do kernel Linux para a versão `6.12.115+deb13.1-amd64`:

```bash
sudo apt update
sudo apt upgrade -y
```

<img src="./05- SecOps/02-apt-upgrade-pacotes.jpg" width="550">

<img src="./05- SecOps/03-apt-upgrade-kernel-grub.png" width="550">

### 3.3. Configuração de Rede Estática e Resolução Local

O endereçamento IPv4 fixo foi declarado no arquivo `/etc/network/interfaces` sobre a interface `eth0`:

```text
auto lo
iface lo inet loopback

auto eth0
iface eth0 inet static
    address 10.10.1.60/24
    gateway 10.10.1.1
    dns-nameservers 10.10.1.10
```

O hostname da instância foi definido como `web01` e mapeado no arquivo `/etc/hosts` junto ao endereço de loopback `127.0.0.1`:

```bash
sudo hostnamectl set-hostname web01
```

```text
127.0.0.1   localhost
127.0.0.1   web01.corp.local web01
```

### 3.4. Controle de Acesso e Firewall UFW

Foi criado o usuário administrativo dedicado `apache_admin` com filiação ao grupo `sudo` para operações de manutenção do serviço web:

```bash
sudo adduser apache_admin
sudo usermod -aG sudo apache_admin
```

<img src="./01 - SysAdmin/04_usuario_apache.jpeg" width="550">

O filtro de pacotes UFW foi configurado com política padrão de bloqueio para conexões de entrada, liberando apenas o tráfego nas portas `22/tcp` para gerência via OpenSSH e `80/tcp` para requisições HTTP:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw enable
```

### 3.5. Instalação do Apache2 e Configuração do VirtualHost

O pacote `apache2` foi instalado a partir do repositório oficial do Debian 13 na versão `2.4.69-1~deb13u1` e habilitado na inicialização do sistema:

```bash
sudo apt install apache2 -y
sudo systemctl enable --now apache2
```

<img src="./05- SecOps/05-apt-install-apache2.jpg" width="550">

Foi criado o arquivo de configuração `/etc/apache2/sites-available/projeto.conf` apontando para o diretório `/var/www/html/projeto_gx`, com bloqueio explícito de listagem de diretórios e separação dos arquivos de log:

```apache
<VirtualHost *:80>
    ServerName web01.corp.local
    DocumentRoot /var/www/html/projeto_gx

    <Directory /var/www/html/projeto_gx>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    ErrorLog /var/log/apache2/error.log
    CustomLog /var/log/apache2/access.log combined
</VirtualHost>
```

O VirtualHost padrão `000-default.conf` foi desabilitado e o arquivo `projeto.conf` foi ativado:

```bash
sudo a2dissite 000-default.conf
sudo a2ensite projeto.conf
sudo systemctl reload apache2
```

<img src="./02 - Apache/08-apache-versao-enabled-vhost.png" width="550">

### 3.6. Permissões de Sistema de Arquivos, Hardening e Rotação de Logs

Os arquivos da aplicação Toca & Cia foram alocados em `/var/www/html/projeto_gx`. A propriedade recursiva foi atribuída ao usuário e grupo de serviço `www-data:www-data`, aplicando modo octal `755` para diretórios e `644` para arquivos estáticos:

```bash
sudo chown -R www-data:www-data /var/www/html/projeto_gx
sudo find /var/www/html/projeto_gx -type d -exec chmod 755 {} \;
sudo find /var/www/html/projeto_gx -type f -exec chmod 644 {} \;
```

<img src="./02 - Apache/10-diretorio-projeto-gx-permissoes.png" width="550">

Para suprimir a exposição da versão do Apache e do sistema operacional nos cabeçalhos de resposta HTTP e em páginas de erro, o arquivo `/etc/apache2/conf-enabled/security.conf` foi ajustado com as diretivas `ServerTokens Prod` e `ServerSignature Off`:

```bash
sudo sed -i 's/^ServerTokens .*/ServerTokens Prod/' /etc/apache2/conf-enabled/security.conf
sudo sed -i 's/^ServerSignature .*/ServerSignature Off/' /etc/apache2/conf-enabled/security.conf
sudo systemctl reload apache2
```

<img src="./05- SecOps/13-grep-hardening-servertokens-prod-indexes.png" width="550">

A política de retenção e compressão dos registros `access.log` e `error.log` foi verificada em `/etc/logrotate.d/apache2`, mantendo rotação diária de 14 ciclos com compressão habilitada e permissões `640 root adm`:

<img src="./05- SecOps/14-permissoes-755-644-logrotate-apache2.jpg" width="550">

---

## 4. Resultados da Validação de Qualidade

A equipe de QA executou os testes obrigatórios de verificação do serviço, sintaxe, conectividade HTTP por IP e DNS, inspeção de código-fonte e persistência após reinicialização.

### 4.1. Status do Daemon e Teste de Sintaxe

O serviço `apache2.service` foi validado em estado `active (running)` e `enabled` no `systemd`. A verificação de sintaxe dos arquivos de configuração retornou `Syntax OK` e o dump de VirtualHosts confirmou o registro de `web01.corp.local` na porta `*:80`:

```bash
sudo systemctl status apache2
sudo apachectl configtest
sudo apachectl -S
```

<img src="./05- SecOps/07-service-apache2-status.jpg" width="550">

<img src="./05- SecOps/12-apachectl-configtest-syntax-ok.jpg" width="550">

<img src="./05- SecOps/11-apachectl-S-virtualhost.jpg" width="550">

### 4.2. Teste de Requisição HTTP Local e por Endereço IP Fixo

A resposta do servidor web foi testada localmente via `http://localhost` e diretamente pelo endereço estático `http://10.10.1.60` na interface `eth0`, retornando código de status `HTTP/1.1 200 OK`:

```bash
ip -4 addr show eth0
curl -I http://localhost
curl -I http://10.10.1.60
```

<img src="./05- SecOps/08-curl-http-200-ok.jpg" width="550">

<img src="./02 - Apache/04-apache.jpeg" width="550">

### 4.3. Teste de Resolução de Nome e Resposta por Domínio

O teste de resolução de nome e requisição HTTP para `web01.corp.local` confirmou perda de pacotes `0%` no protocolo ICMP e retorno `HTTP/1.1 200 OK` na camada de aplicação:

```bash
ping -c 2 web01.corp.local
curl -I http://web01.corp.local
```

<img src="./05- SecOps/17-ping-curl-dns-web01-corp-local.png" width="550">

### 4.4. Renderização em Cliente da Rede e Auditoria de Código-Fonte

A aplicação Toca & Cia foi acessada através do navegador do host Windows Server conectado ao `vSwitch-Interno` na rede `10.10.1.0/24`, confirmando a renderização completa dos ativos estáticos em `http://10.10.1.60`.

<img src="./02 - Apache/05-apache.jpeg" width="550">

A inspeção do arquivo `/var/www/html/projeto_gx/index.html` no terminal confirmou a ausência de credenciais, chaves de API ou caminhos internos do sistema de arquivos expostos na marcação HTML:

<img src="./02 - Apache/06-apache.jpeg" width="550">

### 4.5. Teste de Persistência Pós-Reboot

A máquina virtual `web01` foi reinicializada via `sudo reboot`. Após o retorno do sistema, a verificação de `uptime`, `systemctl status apache2` e `curl -I http://localhost` confirmou a subida automática do daemon HTTP e o atendimento imediato na porta 80 sem intervenção manual:

```bash
uptime
sudo systemctl status apache2 --no-pager
curl -I http://localhost
```

<img src="./05- SecOps/18-teste-persistencia-pos-reboot-uptime.png" width="550">

### 4.6. Consolidação da Entrega no Ambiente Oficial

O quadro abaixo sintetiza a validação integrada do endereço `10.10.1.60/24` no Debian 13, da interface `10.10.1.1/24` no Windows Server, do comutador `vSwitch-Interno` no Hyper-V e da resposta `HTTP/1.1 200 OK` da aplicação Toca & Cia:

<img src="./02 - Apache/07-apache-final.jpeg" width="550">
