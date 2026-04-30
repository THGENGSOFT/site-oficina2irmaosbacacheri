/**
 * Auto Mecânica 2 Irmãos - Budget Calculator Engine
 * Arquitetura em Vanilla JS - Padrão Modular
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Dicionário de Dados (A ser validado com o gestor)
    const servicesData = {
        'oleo': { min: 180, max: 350 },
        'freio': { min: 250, max: 600 },
        'injecao': { min: 200, max: 450 },
        'suspensao': { min: 600, max: 1800 },
        'correia': { min: 400, max: 900 },
        'revisao': { min: 800, max: 2500 }
    };

    // 2. Mapeamento de Elementos do DOM
    const form = document.getElementById('budgetForm');
    const resultMinEl = document.getElementById('calcTotalMin');
    const resultMaxEl = document.getElementById('calcTotalMax');
    const btnSend = document.getElementById('btnSendBudget');
    
    // 3. Função Central de Cálculo
    const calculateBudget = () => {
        // Coleta o multiplicador do veículo selecionado (Ex: 1.0, 1.2, 1.5)
        const carMultiplier = parseFloat(document.querySelector('input[name="carType"]:checked').value);
        
        // Coleta todos os serviços marcados
        const selectedServices = document.querySelectorAll('input[name="services"]:checked');
        
        let totalMin = 0;
        let totalMax = 0;

        selectedServices.forEach(checkbox => {
            const serviceKey = checkbox.value;
            if (servicesData[serviceKey]) {
                totalMin += servicesData[serviceKey].min;
                totalMax += servicesData[serviceKey].max;
            }
        });

        // Aplica o multiplicador do tipo de carro
        totalMin = totalMin * carMultiplier;
        totalMax = totalMax * carMultiplier;

        // Atualiza a UI formatando para Real (BRL)
        resultMinEl.textContent = totalMin.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        resultMaxEl.textContent = totalMax.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // Habilita/Desabilita o botão do WhatsApp baseado na seleção
        btnSend.disabled = selectedServices.length === 0;
    };

    // 4. Função Geradora do Link do WhatsApp
    const sendToWhatsApp = () => {
        // Pega o texto da label do veículo selecionado
        const carTypeName = document.querySelector('input[name="carType"]:checked').nextElementSibling.textContent.trim();
        
        // Pega o nome legível dos serviços
        const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
                                      .map(cb => cb.getAttribute('data-name'));
        
        const minVal = resultMinEl.textContent;
        const maxVal = resultMaxEl.textContent;

        // Constrói a mensagem
        let message = `Olá! Fiz uma simulação de orçamento no site da oficina.\n\n`;
        message += `🚘 *Veículo:* ${carTypeName}\n`;
        message += `🔧 *Serviços Selecionados:*\n- ${selectedServices.join('\n- ')}\n\n`;
        message += `💰 *Estimativa Pelo Site:* R$ ${minVal} até R$ ${maxVal}\n\n`;
        message += `Gostaria de agendar uma avaliação física para confirmar o valor. Qual é a disponibilidade?`;

        // Codifica a URL e dispara o redirecionamento
        const whatsappNumber = "5541987141580";
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    };

    // 5. Listeners (Escutadores de Eventos)
    form.addEventListener('change', calculateBudget);
    btnSend.addEventListener('click', sendToWhatsApp);

});