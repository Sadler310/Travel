const { createApp, ref, computed } = Vue;

createApp({
    setup() {
        const tripName = ref('');
        const dates = ref('');
        const currency = ref('$');

        // Глобальный транспорт
        const transportExpenses = ref([
            { id: 201, name: '', category: 'Авиабилеты', amount: null, isCustomCategory: false }
        ]);

        const destinations = ref([
            {
                id: 1,
                name: '',
                dates: '',
                expenses: [
                    { id: 101, name: '', category: 'Жилье', amount: null, isCustomCategory: false },
                    { id: 102, name: '', category: 'Еда и рестораны', amount: null, isCustomCategory: false }
                ]
            }
        ]);

        // Методы для транспорта
        const addTransport = () => {
            transportExpenses.value.push({ id: Date.now(), name: '', category: 'Поезд', amount: null, isCustomCategory: false });
        };

        const removeTransport = (id) => {
            transportExpenses.value = transportExpenses.value.filter(t => t.id !== id);
        };

        const transportTotalNum = computed(() => {
            return transportExpenses.value.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        });

        // Методы для направлений
        const addDestination = () => {
            destinations.value.push({
                id: Date.now(),
                name: '',
                dates: '',
                expenses: [
                    { id: Date.now() + 1, name: '', category: 'Жилье', amount: null, isCustomCategory: false }
                ]
            });
        };

        const removeDestination = (id) => {
            destinations.value = destinations.value.filter(d => d.id !== id);
        };

        const addExpense = (destId) => {
            const dest = destinations.value.find(d => d.id === destId);
            if (dest) {
                dest.expenses.push({ id: Date.now(), name: '', category: 'Еда и рестораны', amount: null, isCustomCategory: false });
            }
        };

        const removeExpense = (destId, expId) => {
            const dest = destinations.value.find(d => d.id === destId);
            if (dest) {
                dest.expenses = dest.expenses.filter(e => e.id !== expId);
            }
        };

        const destTotal = (dest) => {
            return dest.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0).toLocaleString();
        };

        // Общая сумма = Транспорт + Направления
        const grandTotal = computed(() => {
            const destTotalSum = destinations.value.reduce((sum, dest) => {
                return sum + dest.expenses.reduce((s, exp) => s + (exp.amount || 0), 0);
            }, 0);
            return (destTotalSum + transportTotalNum.value).toLocaleString();
        });

        const exportPDF = () => {
            const element = document.getElementById('export-area');
            const opt = {
                margin:       0.5,
                filename:     'travel_budget.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        };

        return {
            tripName, dates, currency, 
            transportExpenses, addTransport, removeTransport, transportTotalNum,
            destinations, addDestination, removeDestination, addExpense, removeExpense,
            destTotal, grandTotal, exportPDF
        };
    }
}).mount('#app');
