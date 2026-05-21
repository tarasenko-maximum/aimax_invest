/* ==========================================================================
   AIMAX PREMIUM LANDING-PRESENTATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------------
    // 1. SCROLL MECHANICS (Progress Bar, Scroll-Spy, Animations)
    // ----------------------------------------------------------------------
    
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Scroll Progress Indicator
    function updateScrollProgress() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
            const scrollPercent = (window.scrollY / scrollHeight) * 100;
            scrollProgress.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
        }
    }
    
    // Scroll-Spy: Highlight active nav items
    function updateScrollSpy() {
        let current = '';
        const scrollPosition = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        
        // If we are at the very bottom of the page, activate the last nav item (contacts)
        if (scrollPosition + clientHeight >= scrollHeight - 20) {
            current = 'contacts';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120; // offset for sticky header
                const sectionHeight = section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
        }
        
        if (!current && sections.length > 0) {
            current = sections[0].getAttribute('id');
        }
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }
    
    // Scroll-triggered animations using IntersectionObserver
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
    });
    
    document.querySelectorAll('.fade-in-up').forEach(element => {
        animationObserver.observe(element);
    });
    
    // Listeners for Scroll Mechanics
    window.addEventListener('scroll', () => {
        updateScrollProgress();
        updateScrollSpy();
    });
    
    // Initial calls
    updateScrollProgress();
    updateScrollSpy();

    // ----------------------------------------------------------------------
    // 2. CHART.JS CONFIGURATION & STYLING
    // ----------------------------------------------------------------------
    
    // Global Chart.js Defaults
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Outfit', 'Inter', -apple-system, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.boxWidth = 8;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(10, 10, 22, 0.95)';
    Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
    Chart.defaults.plugins.tooltip.bodyColor = '#f1f1f7';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(99, 102, 241, 0.2)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    
    const gridStyle = {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false
    };

    // --- CHART 1: TRACTION & FORECAST CHART ---
    let tractionChartInstance = null;
    const tractionCtx = document.getElementById('tractionChart').getContext('2d');
    
    const months = ['Июн 26', 'Июл 26', 'Авг 26', 'Сен 26', 'Окт 26', 'Ноя 26', 'Дек 26', 'Янв 27', 'Фев 27', 'Мар 27', 'Апр 27', 'Май 27'];
    
    // Revenue Data
    const dataMRR = [8000, 8500, 9000, 10500, 12000, 13500, 15000, 16500, 18000, 19500, 21000, 22000];
    const dataSetup = [3000, 5000, 7000, 10500, 14500, 19000, 24000, 28000, 32000, 36500, 41000, 47000];
    const dataPartner = [1000, 1500, 2000, 3000, 4500, 5500, 7000, 7500, 8000, 9000, 10000, 11000];
    
    // Cash Flow & Balance Data
    const dataCashBalance = [11000, 13000, 10000, 55000, 88500, 111000, 134000, 140500, 154000, 174500, 202000, 236500];
    const dataNetFlow = [11000, 2000, -3000, 45000, 33500, 22500, 23000, 6500, 13500, 20500, 27500, 34500];

    function showRevenueChart() {
        if (tractionChartInstance) tractionChartInstance.destroy();
        
        tractionChartInstance = new Chart(tractionCtx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'MRR (Подписки)',
                        data: dataMRR,
                        backgroundColor: '#6366f1', // Indigo
                        borderRadius: 4
                    },
                    {
                        label: 'Setup (Внедрение)',
                        data: dataSetup,
                        backgroundColor: '#a855f7', // Purple
                        borderRadius: 4
                    },
                    {
                        label: 'Партнерский канал',
                        data: dataPartner,
                        backgroundColor: '#f97316', // Orange
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        grid: gridStyle
                    },
                    y: {
                        stacked: true,
                        grid: gridStyle,
                        ticks: {
                            callback: value => '€' + value.toLocaleString('ru-RU')
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { padding: 20 }
                    },
                    tooltip: {
                        callbacks: {
                            label: context => `${context.dataset.label}: €${context.parsed.y.toLocaleString('ru-RU')}`,
                            footer: tooltipItems => {
                                const total = tooltipItems.reduce((sum, item) => sum + item.parsed.y, 0);
                                return `Итого выручка: €${total.toLocaleString('ru-RU')}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function showCashflowChart() {
        if (tractionChartInstance) tractionChartInstance.destroy();
        
        // Create Indigo/Cyan Gradients
        const balanceGradient = tractionCtx.createLinearGradient(0, 0, 0, 300);
        balanceGradient.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
        balanceGradient.addColorStop(1, 'rgba(6, 182, 212, 0.01)');
        
        tractionChartInstance = new Chart(tractionCtx, {
            data: {
                labels: months,
                datasets: [
                    {
                        type: 'line',
                        label: 'Баланс счета (Накопленный)',
                        data: dataCashBalance,
                        borderColor: '#06b6d4', // Cyan
                        borderWidth: 3,
                        backgroundColor: balanceGradient,
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: '#06b6d4',
                        pointBorderColor: '#06060c',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        yAxisID: 'y'
                    },
                    {
                        type: 'bar',
                        label: 'Чистый поток за месяц',
                        data: dataNetFlow,
                        backgroundColor: context => {
                            const val = context.raw;
                            return val >= 0 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)';
                        },
                        borderColor: context => {
                            const val = context.raw;
                            return val >= 0 ? '#10b981' : '#ef4444';
                        },
                        borderWidth: 1,
                        borderRadius: 4,
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: gridStyle
                    },
                    y: {
                        grid: gridStyle,
                        ticks: {
                            callback: value => '€' + value.toLocaleString('ru-RU')
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { padding: 20 }
                    },
                    tooltip: {
                        callbacks: {
                            label: context => `${context.dataset.label}: €${context.raw.toLocaleString('ru-RU')}`
                        }
                    }
                }
            }
        });
    }
    
    // Switch Buttons for Chart 1
    const btnShowRevenue = document.getElementById('btn-show-revenue');
    const btnShowCashflow = document.getElementById('btn-show-cashflow');
    
    if (btnShowRevenue && btnShowCashflow) {
        btnShowRevenue.addEventListener('click', () => {
            btnShowRevenue.classList.add('active');
            btnShowCashflow.classList.remove('active');
            showRevenueChart();
        });
        
        btnShowCashflow.addEventListener('click', () => {
            btnShowCashflow.classList.add('active');
            btnShowRevenue.classList.remove('active');
            showCashflowChart();
        });
    }

    // Default to show Revenue on load
    showRevenueChart();


    // --- CHART 2: MARKET VALUATION COMPARISON CHART ---
    const positioningCtx = document.getElementById('positioningChart').getContext('2d');
    
    new Chart(positioningCtx, {
        type: 'bar',
        data: {
            labels: ['AIMAX (Наш раунд)', 'Европа AI Pre-Seed Медиана', 'RobosizeME (Seed)', 'Cassidy (Seed)'],
            datasets: [{
                data: [3.8, 5.6, 10.0, 15.0],
                backgroundColor: [
                    '#06b6d4', // Highlight AIMAX in Electric Cyan
                    'rgba(99, 102, 241, 0.45)', // Indigo
                    'rgba(168, 85, 247, 0.25)', // Purple
                    'rgba(168, 85, 247, 0.25)'  // Purple
                ],
                borderColor: [
                    '#06b6d4',
                    '#6366f1',
                    '#a855f7',
                    '#a855f7'
                ],
                borderWidth: 1.5,
                borderRadius: 6,
                barThickness: 28
            }]
        },
        options: {
            indexAxis: 'y', // Makes the chart horizontal
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: gridStyle,
                    ticks: {
                        callback: value => '€' + value + 'M'
                    }
                },
                y: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: context => `Pre-money оценка: €${context.raw.toFixed(1)}M`
                    }
                }
            }
        }
    });


    // --- CHART 3: USE OF FUNDS DOUGHNUT CHART ---
    const allocationCtx = document.getElementById('allocationChart').getContext('2d');
    
    new Chart(allocationCtx, {
        type: 'doughnut',
        data: {
            labels: ['Маркетинг ЕС/США', 'Расширение команды', 'Технологическое усиление', 'Юридическое оформление'],
            datasets: [{
                data: [50.0, 30.0, 12.5, 7.5],
                backgroundColor: [
                    '#06b6d4', // Cyan
                    '#6366f1', // Indigo
                    '#a855f7', // Purple
                    '#f97316'  // Orange
                ],
                borderWidth: 3,
                borderColor: '#0b0b18', // Match card dark bg to look clean
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%', // Stylish thin ring
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: context => ` ${context.label}: ${context.raw}% (€${(200000 * context.raw / 100).toLocaleString('ru-RU')})`
                    }
                }
            }
        }
    });


    // --- CHART 4: RUSSIAN TRACK RETURN CHART ---
    const russiaCtx = document.getElementById('russiaTrackChart').getContext('2d');
    
    // Russian track starting September 2026, values for Jun, Jul, Aug are 0.
    const dataRussiaMonthly = [0, 0, 0, 2350, 3760, 5170, 6580, 7990, 9400, 10810, 12220, 14100];
    const dataRussiaCumulative = [0, 0, 0, 2350, 6110, 11280, 17860, 25850, 35250, 46060, 58280, 72380];
    
    // Create Green Gradient for Cumulative Area
    const cumulativeGradient = russiaCtx.createLinearGradient(0, 0, 0, 240);
    cumulativeGradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    cumulativeGradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');
    
    new Chart(russiaCtx, {
        data: {
            labels: months,
            datasets: [
                {
                    type: 'line',
                    label: 'Накопленный возврат',
                    data: dataRussiaCumulative,
                    borderColor: '#10b981', // Emerald Green
                    borderWidth: 3,
                    backgroundColor: cumulativeGradient,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#0b0b18',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    yAxisID: 'y'
                },
                {
                    type: 'bar',
                    label: 'Выплата инвестору за месяц',
                    data: dataRussiaMonthly,
                    backgroundColor: 'rgba(99, 102, 241, 0.65)', // Muted Indigo
                    borderColor: '#6366f1',
                    borderWidth: 1,
                    borderRadius: 3,
                    barThickness: 16,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: gridStyle
                },
                y: {
                    grid: gridStyle,
                    ticks: {
                        callback: value => '€' + value.toLocaleString('ru-RU')
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { padding: 15 }
                },
                tooltip: {
                    callbacks: {
                        label: context => `${context.dataset.label}: €${context.raw.toLocaleString('ru-RU')}`
                    }
                }
            }
        }
    });
    
});
