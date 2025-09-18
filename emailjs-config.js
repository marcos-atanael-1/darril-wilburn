

// 🔧 CONFIGURAÇÃO NECESSÁRIA - Substitua pelos seus valores reais do EmailJS
window.EMAILJS_CONFIG = {
    // 🔑 Chave Pública (Public Key) - Obtida em Account > General
    PUBLIC_KEY: 'C0qMQbHPa6WgbFsOo',    // Ex: 'user_abc123def456'
    
    // 🔧 ID do Serviço de Email - Criado em Email Services
    SERVICE_ID: 'service_rzoqy7v',    // Ex: 'gmail_service' ou 'outlook_service'
    
    // 📧 ID do Template - Criado em Email Templates  
    TEMPLATE_ID: 'template_hntbn89'   // Ex: 'contact_template'
};

// Template Configuration
// Subject line: "New message from {{first_name}} {{last_name}} - {{organization}}"
// Note: Template is in English for professional use
// Form fields: first_name, last_name, email, organization, interest, message

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

// 🔍 Função para verificar se a configuração está completa
window.checkEmailJSConfig = function() {
    const config = window.EMAILJS_CONFIG;
    const isConfigured = 
        config.PUBLIC_KEY !== 'FrdtJd9NCxk_ngYs5' &&
        config.SERVICE_ID !== 'service_87y4jjq' &&
        config.TEMPLATE_ID !== 'template_g81et4q';
    
    if (isConfigured) {
        console.log('✅ Configuração do EmailJS está completa!');
        return true;
    } else {
        console.warn('⚠️  Configuração incompleta. Edite emailjs-config.js com suas chaves reais.');
        return false;
    }
};

// 📧 Função para mapear campos do formulário INDEX para variáveis do template
window.getTemplateParamsIndex = function() {
    const templateParams = {
      first_name: document.getElementById('firstName').value,
      last_name: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      company: document.getElementById('company').value,
      phone: document.getElementById('phone').value || 'Not provided',
      interest: document.getElementById('interest').value,
      timeline: document.getElementById('timeline').value || 'Not specified',
      message: document.getElementById('message').value,
      to_name: 'Darril Wilburn'
    };
    return templateParams;
};

// 📧 Função para mapear campos do formulário CONTACT para variáveis do template
window.getTemplateParamsContact = function() {
    const templateParams = {
      first_name: document.getElementById('contact-firstName').value,
      last_name: document.getElementById('contact-lastName').value,
      email: document.getElementById('contact-email').value,
      company: document.getElementById('contact-company').value,
      phone: document.getElementById('contact-phone').value || 'Not provided',
      interest: document.getElementById('contact-interest').value,
      timeline: document.getElementById('contact-timeline').value || 'Not specified',
      message: document.getElementById('contact-message').value,
      to_name: 'Darril Wilburn'
    };
    return templateParams;
};

// 📧 Função compatível com configuração anterior (mantida para compatibilidade)
window.getTemplateParams = function() {
    // Detectar qual formulário está sendo usado
    if (document.getElementById('firstName')) {
        return window.getTemplateParamsIndex();
    } else if (document.getElementById('contact-firstName')) {
        return window.getTemplateParamsContact();
    } else {
        console.error('Nenhum formulário compatível encontrado');
        return {};
    }
};

// Verificar configuração automaticamente
setTimeout(() => {
    window.checkEmailJSConfig();
}, 1000);

// ========================================
// HANDLERS DOS FORMULÁRIOS
// ========================================

// Email validation
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Show form status messages
function showFormStatus(message, type, formElement) {
    // Remove any existing status messages
    const existingStatus = formElement.parentNode.querySelector('.form-status-message');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    // Create new status message
    const statusDiv = document.createElement('div');
    statusDiv.className = 'form-status-message';
    statusDiv.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 8px;
        text-align: center;
        font-weight: 500;
        ${type === 'success' 
            ? 'background-color: #d1fae5; border: 1px solid #10b981; color: #065f46;' 
            : 'background-color: #fee2e2; border: 1px solid #ef4444; color: #991b1b;'
        }
    `;
    statusDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        <span style="margin-left: 0.5rem;">${message}</span>
    `;
    
    // Insert after form
    formElement.parentNode.insertBefore(statusDiv, formElement.nextSibling);
    
    // Hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (statusDiv.parentNode) {
                statusDiv.remove();
            }
        }, 5000);
    }
}

// Generic form handler
function handleFormSubmission(e, getTemplateParamsFunction) {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    const originalButtonContent = button.innerHTML;
    
    // Basic validation
    const formData = new FormData(form);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const message = formData.get('message');
    const interest = formData.get('interest');
    
    if (!firstName || !lastName) {
        showFormStatus('Please enter both first and last name', 'error', form);
        return;
    }
    
    if (!isValidEmail(email)) {
        showFormStatus('Please enter a valid email address', 'error', form);
        return;
    }
    
    if (!interest) {
        showFormStatus('Please select what you are interested in', 'error', form);
        return;
    }
    
    if (!message || message.length < 10) {
        showFormStatus('Please provide a more detailed message (at least 10 characters)', 'error', form);
        return;
    }
    
    // Update button state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    button.disabled = true;
    
    // Check if EmailJS is available and configured
    if (typeof emailjs === 'undefined') {
        showFormStatus('EmailJS service is not available. Please try again later.', 'error', form);
        button.innerHTML = originalButtonContent;
        button.disabled = false;
        return;
    }
    
    if (!window.EMAILJS_CONFIG) {
        showFormStatus('Email service configuration is missing. Please contact the administrator.', 'error', form);
        button.innerHTML = originalButtonContent;
        button.disabled = false;
        return;
    }
    
    // Prepare template parameters
    let templateParams;
    try {
        templateParams = getTemplateParamsFunction();
    } catch (error) {
        console.error('Error getting template params:', error);
        showFormStatus('Error preparing email data. Please try again.', 'error', form);
        button.innerHTML = originalButtonContent;
        button.disabled = false;
        return;
    }
    
    console.log('Sending email with params:', templateParams);
    
    // Send email using EmailJS
    emailjs.send(
        window.EMAILJS_CONFIG.SERVICE_ID,
        window.EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
    )
    .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        showFormStatus('Message sent successfully! Darril will get back to you soon.', 'success', form);
        form.reset();
    })
    .catch((error) => {
        console.error('EmailJS error:', error);
        let errorMessage = 'Sorry, there was an error sending your message. Please try again or email directly at d.wilburn@honsha.org.';
        
        if (error.status === 422) {
            errorMessage = 'Please check all required fields and try again.';
        } else if (error.status === 400) {
            errorMessage = 'Invalid request. Please refresh the page and try again.';
        }
        
        showFormStatus(errorMessage, 'error', form);
    })
    .finally(() => {
        button.innerHTML = originalButtonContent;
        button.disabled = false;
    });
}

// Handler específico para formulário INDEX
function handleIndexForm(e) {
    handleFormSubmission(e, window.getTemplateParamsIndex);
}

// Handler específico para formulário CONTACT
function handleContactForm(e) {
    handleFormSubmission(e, window.getTemplateParamsContact);
}

// Initialize form handling
function initializeFormHandling() {
    // Index form handler (ID: book-darril-form)
    const indexForm = document.querySelector('#book-darril-form');
    if (indexForm) {
        indexForm.addEventListener('submit', handleIndexForm);
        console.log('✅ Index form handler initialized');
    }
    
    // Contact form handler (ID: contact-form)
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
        console.log('✅ Contact form handler initialized');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFormHandling();
});