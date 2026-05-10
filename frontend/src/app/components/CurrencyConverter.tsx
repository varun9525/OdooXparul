import { useState, useEffect } from 'react';
import { RefreshCw, DollarSign } from 'lucide-react';

export const CurrencyConverter = ({ baseCurrency }: { baseCurrency: string }) => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [amount, setAmount] = useState('100');
  const [toCurrency, setToCurrency] = useState(baseCurrency === 'USD' ? 'EUR' : 'USD');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
        const data = await res.json();
        setRates(data.rates || {});
      } catch (err) {
        console.error("Failed to fetch exchange rates");
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, [baseCurrency]);

  const converted = amount && rates[toCurrency] ? (Number(amount) * rates[toCurrency]).toFixed(2) : '0.00';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-indigo-500" /> Live Converter
        </h4>
        {loading && <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />}
      </div>
      
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-white/50">{baseCurrency}</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold dark:border-white/10 dark:bg-slate-900 dark:text-white outline-none"
          />
        </div>
        <div className="flex items-end pb-2 text-slate-400">=</div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-white/50 flex justify-between">
            To
            <select 
              value={toCurrency} 
              onChange={(e) => setToCurrency(e.target.value)}
              className="bg-transparent font-bold text-indigo-600 outline-none"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="JPY">JPY</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
            </select>
          </label>
          <div className="w-full rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 font-black text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
            {converted}
          </div>
        </div>
      </div>
    </div>
  );
};
