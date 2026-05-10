import { useState, useEffect } from 'react';
import { RefreshCw, DollarSign, ArrowRightLeft } from 'lucide-react';

const COMMON_CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "CAD", "AUD", "CHF", "CNY", "BRL"];

export const CurrencyConverter = ({ baseCurrency }: { baseCurrency: string }) => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState(baseCurrency || 'USD');
  const [toCurrency, setToCurrency] = useState(baseCurrency === 'USD' ? 'EUR' : 'USD');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
        const data = await res.json();
        setRates(data.rates || {});
      } catch (err) {
        console.error("Failed to fetch exchange rates");
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, [fromCurrency]);

  const converted = amount && rates[toCurrency] ? (Number(amount) * rates[toCurrency]).toFixed(2) : '0.00';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-indigo-500" /> Live Converter
        </h4>
        {loading && <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />}
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 flex justify-between text-xs font-bold text-slate-500 dark:text-slate-300">
            From
            <select 
              value={fromCurrency} 
              onChange={(e) => setFromCurrency(e.target.value)}
              className="bg-transparent font-black text-indigo-600 outline-none dark:text-indigo-300 [&>option]:bg-white dark:[&>option]:bg-slate-900"
            >
              {COMMON_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-900 outline-none dark:border-white/20 dark:bg-slate-900/80 dark:text-white"
          />
        </div>
        
        <div className="hidden pb-3 text-slate-400 sm:block">
          <ArrowRightLeft className="h-5 w-5" />
        </div>
        <div className="flex justify-center pb-0 text-slate-400 sm:hidden">
          <ArrowRightLeft className="h-5 w-5 rotate-90" />
        </div>
        
        <div className="flex-1">
          <label className="mb-1 flex justify-between text-xs font-bold text-slate-500 dark:text-slate-300">
            To
            <select 
              value={toCurrency} 
              onChange={(e) => setToCurrency(e.target.value)}
              className="bg-transparent font-black text-indigo-600 outline-none dark:text-indigo-300 [&>option]:bg-white dark:[&>option]:bg-slate-900"
            >
              {COMMON_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <div className="flex w-full items-center rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 font-black text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
            {converted}
          </div>
        </div>
      </div>
    </div>
  );
};
