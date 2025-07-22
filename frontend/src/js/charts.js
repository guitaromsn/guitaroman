// Chart.js Configuration for Amanat Al-Kalima ERP Dashboard

class DashboardCharts {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        // Wait for DOM to be loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeCharts();
            });
        } else {
            this.initializeCharts();
        }
    }

    initializeCharts() {
        this.initSalesChart();
        this.initRevenueChart();
    }

    // Chart theme colors matching the ERP theme
    getChartTheme() {
        return {
            primary: '#d2691e',
            secondary: '#ff8c00',
            success: '#28a745',
            warning: '#ffc107',
            danger: '#dc3545',
            text: '#ffffff',
            textSecondary: '#b3b3b3',
            grid: '#404040',
            background: '#2d2d2d'
        };
    }

    // Common chart configuration
    getCommonConfig() {
        const theme = this.getChartTheme();
        
        return {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: theme.text,
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: theme.background,
                    titleColor: theme.text,
                    bodyColor: theme.text,
                    borderColor: theme.primary,
                    borderWidth: 1,
                    cornerRadius: 8,
                    titleFont: {
                        family: 'Inter',
                        weight: '600'
                    },
                    bodyFont: {
                        family: 'Inter'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: theme.textSecondary,
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    },
                    grid: {
                        color: theme.grid,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: theme.textSecondary,
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    },
                    grid: {
                        color: theme.grid,
                        drawBorder: false
                    }
                }
            }
        };
    }

    initSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        const theme = this.getChartTheme();
        const config = this.getCommonConfig();

        // Sample data - replace with real data in production
        const salesData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Sales',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                backgroundColor: `${theme.primary}20`,
                borderColor: theme.primary,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: theme.primary,
                pointBorderColor: theme.primary,
                pointHoverBackgroundColor: theme.secondary,
                pointHoverBorderColor: theme.secondary,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        };

        this.charts.sales = new Chart(ctx, {
            type: 'line',
            data: salesData,
            options: {
                ...config,
                plugins: {
                    ...config.plugins,
                    legend: {
                        display: false
                    }
                },
                scales: {
                    ...config.scales,
                    y: {
                        ...config.scales.y,
                        beginAtZero: true,
                        ticks: {
                            ...config.scales.y.ticks,
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    initRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        const theme = this.getChartTheme();
        const config = this.getCommonConfig();

        // Sample data - replace with real data in production
        const revenueData = {
            labels: ['Products', 'Services', 'Subscriptions', 'Support'],
            datasets: [{
                label: 'Revenue Distribution',
                data: [45000, 25000, 18000, 12000],
                backgroundColor: [
                    theme.primary,
                    theme.secondary,
                    theme.success,
                    theme.warning
                ],
                borderColor: [
                    theme.primary,
                    theme.secondary,
                    theme.success,
                    theme.warning
                ],
                borderWidth: 2,
                hoverBackgroundColor: [
                    `${theme.primary}CC`,
                    `${theme.secondary}CC`,
                    `${theme.success}CC`,
                    `${theme.warning}CC`
                ]
            }]
        };

        this.charts.revenue = new Chart(ctx, {
            type: 'doughnut',
            data: revenueData,
            options: {
                ...config,
                plugins: {
                    ...config.plugins,
                    legend: {
                        ...config.plugins.legend,
                        position: 'bottom',
                        labels: {
                            ...config.plugins.legend.labels,
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                },
                scales: {}, // Remove scales for doughnut chart
                cutout: '60%',
                animation: {
                    animateRotate: true,
                    animateScale: false
                }
            }
        });
    }

    // Method to update chart data (for real-time updates)
    updateChart(chartName, newData) {
        if (this.charts[chartName]) {
            this.charts[chartName].data = newData;
            this.charts[chartName].update();
        }
    }

    // Method to update charts when language changes
    updateChartsForLanguage() {
        // Update chart labels based on current language
        const isArabic = translationManager && translationManager.isRTL();
        
        if (this.charts.sales) {
            // Update month labels for Arabic
            if (isArabic) {
                this.charts.sales.data.labels = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
            } else {
                this.charts.sales.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            }
            this.charts.sales.update();
        }

        if (this.charts.revenue) {
            // Update category labels for Arabic
            if (isArabic) {
                this.charts.revenue.data.labels = ['المنتجات', 'الخدمات', 'الاشتراكات', 'الدعم'];
            } else {
                this.charts.revenue.data.labels = ['Products', 'Services', 'Subscriptions', 'Support'];
            }
            this.charts.revenue.update();
        }
    }

    // Method to resize charts (useful for responsive design)
    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            chart.resize();
        });
    }

    // Method to destroy all charts (cleanup)
    destroy() {
        Object.values(this.charts).forEach(chart => {
            chart.destroy();
        });
        this.charts = {};
    }
}

// Initialize charts
let dashboardCharts;

document.addEventListener('DOMContentLoaded', () => {
    dashboardCharts = new DashboardCharts();
    
    // Listen for language changes to update chart labels
    document.addEventListener('languageChanged', () => {
        if (dashboardCharts) {
            dashboardCharts.updateChartsForLanguage();
        }
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (dashboardCharts) {
        dashboardCharts.resizeCharts();
    }
});

// Export for use in other scripts
window.DashboardCharts = DashboardCharts;