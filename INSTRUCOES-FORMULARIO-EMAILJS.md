# 📧 Instruções para Implementar Formulário com EmailJS

## 📋 Lista de Verificação Rápida

Quando você quiser implementar a mesma solução de formulário EmailJS em um novo site, envie este arquivo para o assistente e peça para seguir estas instruções.

---

## 🔧 Pré-requisitos

### 1. Configuração da Conta EmailJS
- **Email**: [Usar conta específica para Darril Wilburn]
- **Public Key**: [Atualizar com chave do projeto Darril]
- **Private Key**: [Atualizar com chave do projeto Darril]
- **Service ID**: [Criar novo serviço para Darril]
- **Template ID**: [Usar template personalizado do Darril]

**NOTA**: As configurações atuais são do projeto anterior. Para Darril Wilburn, você precisará:
1. Criar nova conta EmailJS ou usar existente
2. Configurar novo serviço de email
3. Usar o template personalizado em `emailjs-template-darril.html`

### 2. Template do EmailJS (Configurado para Darril Wilburn)
- **Subject**: "New Leadership Inquiry from {{first_name}} {{last_name}} - {{company}}"
- **Campos esperados**: first_name, last_name, email, company, phone, interest, timeline, message
- **Destinatário**: d.wilburn@honsha.org

---

## 🚀 Implementação Passo a Passo

### PASSO 1: Incluir Bibliotecas no HTML
```html
<!-- Adicionar no <head> antes do </head> -->
<!-- EmailJS -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script src="emailjs-config.js"></script>
```

### PASSO 2: Criar arquivo emailjs-config.js
```javascript
// 🔧 CONFIGURAÇÃO NECESSÁRIA - Substitua pelos seus valores reais do EmailJS
window.EMAILJS_CONFIG = {
    // 🔑 Chave Pública (Public Key) - Obtida em Account > General
    PUBLIC_KEY: 'FrdtJd9NCxk_ngYs5',    // Ex: 'user_abc123def456'
    
    // 🔧 ID do Serviço de Email - Criado em Email Services
    SERVICE_ID: 'service_87y4jjq',    // Ex: 'gmail_service' ou 'outlook_service'
    
    // 📧 ID do Template - Criado em Email Templates  
    TEMPLATE_ID: 'template_g81et4q'   // Ex: 'contact_template'
};

// 🚀 Inicialização Automática do EmailJS
if (typeof emailjs !== 'undefined') {
    try {
        emailjs.init(window.EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS inicializado com sucesso!');
        console.log('📧 Serviço:', window.EMAILJS_CONFIG.SERVICE_ID);
        console.log('📝 Template:', window.EMAILJS_CONFIG.TEMPLATE_ID);
    } catch (error) {
        console.error('❌ Erro ao inicializar EmailJS:', error);
    }
} else {
    console.error('❌ EmailJS não foi carregado. Verifique a conexão com a internet.');
}

// 📧 Função para mapear campos do formulário para variáveis do template
window.getTemplateParams = function() {
    // Map form fields to template variables
    const templateParams = {
      first_name: document.getElementById('first-name').value,
      last_name: document.getElementById('last-name').value,
      email: document.getElementById('email').value,
      organization: document.getElementById('organization').value,
      interest: document.getElementById('interest').value,
      message: document.getElementById('message').value,
      to_name: 'Donna Milani Luther'
    };
    return templateParams;
};
```

### PASSO 3: Estrutura do Formulário HTML
```html
<form class="space-y-4" id="contact-form">
    <div class="grid md:grid-cols-2 gap-4">
        <input type="text" id="first-name" name="first-name" placeholder="First Name" required>
        <input type="text" id="last-name" name="last-name" placeholder="Last Name" required>
    </div>
    <input type="email" id="email" name="email" placeholder="Email Address" required>
    <input type="text" id="organization" name="organization" placeholder="Organization">
    <select id="interest" name="interest">
        <option value="">I'm interested in...</option>
        <option value="speaking">Speaking & Keynotes</option>
        <option value="consulting">Consulting</option>
        <option value="insights">Insights & Resources</option>
        <option value="other">Other</option>
    </select>
    <textarea id="message" name="message" rows="4" placeholder="Tell me about your vision and how I might support your work..." required></textarea>
    
    <button type="submit" id="submit-button">
        Send Message
        <i class="fas fa-paper-plane ml-2"></i>
    </button>
    
    <!-- Status Messages -->
    <div id="form-status" class="hidden p-4 rounded-lg text-center"></div>
</form>
```

### PASSO 4: JavaScript para Manuseio do Formulário
```javascript
// Contact form handler
function handleContactForm(e) {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    
    // Basic validation
    const email = form.querySelector('input[name="email"]').value;
    const message = form.querySelector('textarea[name="message"]').value;
    const firstName = form.querySelector('input[name="first-name"]').value;
    const lastName = form.querySelector('input[name="last-name"]').value;
    
    if (!firstName || !lastName) {
        showFormStatus('Please enter both first and last name', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showFormStatus('Please enter a valid email address', 'error');
        return;
    }
    
    if (message.length < 10) {
        showFormStatus('Please provide a more detailed message', 'error');
        return;
    }

    // Update button state
    button.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin ml-2"></i>';
    button.disabled = true;
    
    // Check if EmailJS is available and configured
    if (typeof emailjs === 'undefined') {
        showFormStatus('EmailJS service is not available. Please try again later.', 'error');
        button.innerHTML = 'Send Message <i class="fas fa-paper-plane ml-2"></i>';
        button.disabled = false;
        return;
    }
    
    if (!window.EMAILJS_CONFIG) {
        showFormStatus('Email service configuration is missing. Please contact the administrator.', 'error');
        button.innerHTML = 'Send Message <i class="fas fa-paper-plane ml-2"></i>';
        button.disabled = false;
        return;
    }
    
    // Prepare template parameters
    let templateParams;
    try {
        templateParams = window.getTemplateParams();
    } catch (error) {
        console.error('Error getting template params:', error);
        showFormStatus('Error preparing email data. Please try again.', 'error');
        button.innerHTML = 'Send Message <i class="fas fa-paper-plane ml-2"></i>';
        button.disabled = false;
        return;
    }
    
    // Send email using EmailJS
    emailjs.send(
        window.EMAILJS_CONFIG.SERVICE_ID,
        window.EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
    )
    .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        showFormStatus('Message sent successfully! Donna will get back to you soon.', 'success');
        form.reset();
    })
    .catch((error) => {
        console.error('EmailJS error:', error);
        let errorMessage = 'Sorry, there was an error sending your message. Please try again or email directly.';
        
        if (error.status === 422) {
            errorMessage = 'Please check all required fields and try again.';
        } else if (error.status === 400) {
            errorMessage = 'Invalid request. Please refresh the page and try again.';
        }
        
        showFormStatus(errorMessage, 'error');
    })
    .finally(() => {
        button.innerHTML = 'Send Message <i class="fas fa-paper-plane ml-2"></i>';
        button.disabled = false;
    });
}

// Show form status messages
function showFormStatus(message, type) {
    const statusDiv = document.querySelector('#form-status');
    if (!statusDiv) return;
    
    statusDiv.className = `p-4 rounded-lg text-center ${
        type === 'success' 
            ? 'bg-green-500/20 border border-green-500/30 text-white' 
            : 'bg-red-500/20 border border-red-500/30 text-white'
    }`;
    statusDiv.textContent = message;
    statusDiv.classList.remove('hidden');
    
    // Hide after 5 seconds
    setTimeout(() => {
        statusDiv.classList.add('hidden');
    }, 5000);
}

// Email validation
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Initialize form handling
function initializeFormHandling() {
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFormHandling();
});
```

---

## ✅ Checklist de Implementação

Quando implementar em um novo site, verifique:

- [ ] Bibliotecas EmailJS incluídas no HTML
- [ ] Arquivo emailjs-config.js criado com as configurações
- [ ] Formulário HTML tem todos os IDs necessários
- [ ] JavaScript de manuseio do formulário adicionado
- [ ] Funções de validação incluídas
- [ ] Sistema de status messages implementado
- [ ] Teste de envio funcionando

---

## 🐛 Troubleshooting Comum

### Formulário não envia
1. Verificar se EmailJS foi carregado (`console.log` mostra inicialização)
2. Verificar se todos os IDs dos campos estão corretos
3. Verificar se a função `getTemplateParams()` está funcionando

### Emails não chegam
1. Verificar se Service ID e Template ID estão corretos
2. Verificar se o template do EmailJS está ativo
3. Verificar pasta de spam

### Erros de validação
1. Verificar se todos os campos obrigatórios têm valores
2. Verificar formato do email
3. Verificar tamanho mínimo da mensagem

---

## 📝 Notas Importantes

- **Conta EmailJS**: Sempre usar a conta formsdonnamilaniluther@gmail.com
- **Template**: O template está configurado para receber todos os campos listados
- **Destinatário**: Emails sempre vão para donnamilaniluther@gmail.com
- **Idioma**: Template está em inglês para uso profissional

---

**Para usar estas instruções:**
1. Salve este arquivo
2. Quando quiser implementar em um novo site, envie este arquivo para o assistente
3. Peça para "seguir as instruções do arquivo para implementar o formulário EmailJS"
4. O assistente fará toda a implementação seguindo estes passos
