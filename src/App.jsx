import React, { useState, useEffect } from "react";
import { Home, CheckSquare, Wallet, ArrowDownCircle } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState({ id: "12345", first_name: "Earner", balance: 0.00 });
  const [lastAdTime, setLastAdTime] = useState(0);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) {
        setUser(prev => ({
          ...prev,
          id: tg.initDataUnsafe.user.id.toString(),
          first_name: tg.initDataUnsafe.user.first_name || "User"
        }));
      }
    }
  }, []);

  // Show background ad on tab switch (every 45s)
  const switchTab = (tab) => {
    const now = Date.now();
    if (now - lastAdTime > 45000 && window.Adsgram) {
      try {
        const AdController = window.Adsgram.init({ blockId: "YOUR_ADSGRAM_BLOCK_ID" });
        AdController.show().catch(() => {});
        setLastAdTime(now);
      } catch (e) {}
    }
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white font-sans">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
            {user.first_name[0]}
          </div>
          <span className="font-semibold text-sm">{user.first_name}</span>
        </div>
        <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
          ₹{user.balance.toFixed(2)}
        </div>
      </div>

      {/* Screens */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {activeTab === "home" && <HomeScreen switchTab={switchTab} />}
        {activeTab === "tasks" && <TasksScreen userId={user.id} />}
        {activeTab === "wallet" && <WalletScreen balance={user.balance} />}
        {activeTab === "withdraw" && <WithdrawScreen balance={user.balance} />}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex justify-around items-center">
        <button onClick={() => switchTab("home")} className={`flex flex-col items-center ${activeTab === 'home' ? 'text-blue-500' : 'text-slate-400'}`}>
          <Home size={18} /><span className="text-[10px] mt-1">Home</span>
        </button>
        <button onClick={() => switchTab("tasks")} className={`flex flex-col items-center ${activeTab === 'tasks' ? 'text-blue-500' : 'text-slate-400'}`}>
          <CheckSquare size={18} /><span className="text-[10px] mt-1">Tasks</span>
        </button>
        <button onClick={() => switchTab("wallet")} className={`flex flex-col items-center ${activeTab === 'wallet' ? 'text-blue-500' : 'text-slate-400'}`}>
          <Wallet size={18} /><span className="text-[10px] mt-1">Wallet</span>
        </button>
        <button onClick={() => switchTab("withdraw")} className={`flex flex-col items-center ${activeTab === 'withdraw' ? 'text-blue-500' : 'text-slate-400'}`}>
          <ArrowDownCircle size={18} /><span className="text-[10px] mt-1">Withdraw</span>
        </button>
      </div>
    </div>
  );
}

function TasksScreen({ userId }) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <h3 className="font-bold text-xs text-slate-400 mb-2">⚡ INSTANT TASKS</h3>
        <div className="flex justify-between items-center py-1">
          <div>
            <p className="text-sm font-semibold">Join TG Channel</p>
            <p className="text-xs text-emerald-400">+₹2.00</p>
          </div>
          <button className="bg-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold">Claim</button>
        </div>
      </div>
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <h3 className="font-bold text-xs text-slate-400 mb-2">📝 SURVEYS & OFFERS</h3>
        <button onClick={() => window.open(`https://web.bitlabs.ai/?uid=${userId}`, "_blank")} className="w-full bg-slate-800 p-3 rounded-lg text-left border border-slate-700 mb-2 flex justify-between">
          <span>BitLabs Surveys</span><span className="text-emerald-400 font-bold">Up to ₹80</span>
        </button>
        <button onClick={() => window.open(`https://offers.cpx-research.com/index.php?app_id=YOUR_ID&ext_user_id=${userId}`, "_blank")} className="w-full bg-slate-800 p-3 rounded-lg text-left border border-slate-700 flex justify-between">
          <span>CPX Research</span><span className="text-emerald-400 font-bold">High Match</span>
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ switchTab }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl">
      <h2 className="text-lg font-bold">Earn Real UPI Cash</h2>
      <p className="text-xs text-blue-100 mt-1">Complete tasks, surveys & withdraw instantly</p>
      <button onClick={() => switchTab('tasks')} className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-bold">
        Start Earning
      </button>
    </div>
  );
}

function WalletScreen({ balance }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <p className="text-xs text-slate-400">Available Balance</p>
      <p className="text-2xl font-bold text-emerald-400">₹{balance.toFixed(2)}</p>
    </div>
  );
}

function WithdrawScreen({ balance }) {
  const [upi, setUpi] = useState("");
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
      <label className="text-xs font-bold text-slate-400">UPI ID (e.g. name@oksbi)</label>
      <input type="text" value={upi} onChange={e => setUpi(e.target.value)} placeholder="yourname@upi" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none" />
      <button onClick={() => alert("Withdrawal request submitted for Admin verification!")} className="w-full bg-emerald-600 p-2.5 rounded-xl font-bold text-sm">
        Withdraw to UPI
      </button>
    </div>
  );
  }
