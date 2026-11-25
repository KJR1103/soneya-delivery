import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { ConakryMap } from './ConakryMap';
import { sound } from '../../utils/audio';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Bike,
  Clock,
  Send,
  X,
  Star,
} from 'lucide-react';

interface LiveTrackingViewProps {
  orderId?: string | null;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({ orderId }) => {
  const { orders, activeOrder, setActiveTab, showToast } = useApp();

  const currentOrder: Order | null = orderId
    ? orders.find((o) => o.id === orderId) || activeOrder
    : activeOrder || orders[0] || null;

  const [isCalling, setIsCalling] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'client' | 'rider'; text: string; time: string }[]>([
    {
      sender: 'rider',
      text: "Bonjour ! J'ai récupéré votre commande chez Chez Fanta. Je suis en route vers votre adresse à Kipé.",
      time: '18:04',
    },
  ]);

  const handleCallRider = () => {
    setIsCalling(true);
    sound.playPhoneRing();
    showToast('Appel en cours', 'Connexion directe avec le Rider Soneya (+224 622 12 34 56)...', 'info');
    setTimeout(() => {
      setIsCalling(false);
    }, 4000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg = { sender: 'client' as const, text: chatMessage.trim(), time: timeStr };
    setChatHistory((prev) => [...prev, newMsg]);
    setChatMessage('');
    sound.playSuccess();

    // Auto simulated reply from rider after 2s
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'rider',
          text: "Bien reçu ! J'arrive dans environ 4 minutes.",
          time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes() + 1).padStart(2, '0')}`,
        },
      ]);
      sound.playStatusPing();
    }, 2000);
  };

  const deliveryCode = currentOrder?.deliveryCode || '4821';

  return (
    <div className="max-w-xl mx-auto w-full px-4 py-4 flex flex-col gap-4 pb-28 text-[#0F172A] m-reveal">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-[#E2E8F0] -mx-4 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          aria-label="Retour aux commandes"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] hover:bg-[#DCE3F4] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h1 className="font-headline text-sm font-bold text-[#0F172A]">
          Suivi en direct {currentOrder?.trackingNumber || '#SNY-8420'}
        </h1>

        <span className="font-mono text-xs text-[#1E3A8A] font-bold px-2 py-0.5 rounded-full bg-[#DCE3F4]">
          5 min
        </span>
      </header>

      {/* GPS Map Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
        <div className="h-64 w-full relative">
          <ConakryMap
            partnerLat={9.6012}
            partnerLng={-13.6288}
            partnerName={currentOrder?.partnerName || 'Chez Fanta (Kipé)'}
            liveCourierPos={{ lat: 9.585, lng: -13.65 }}
            clientLat={9.54}
            clientLng={-13.68}
            clientAddress={currentOrder?.clientAddress || 'Kipé, Conakry'}
            courier={currentOrder?.courier}
            orderStatus={currentOrder?.status || 'delivering'}
          />
        </div>

        {/* Floating Route Info Banner */}
        <div className="p-3 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E2E8F0] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#DCE3F4] text-[#1E3A8A] shrink-0">
              <Bike className="w-4 h-4" />
            </span>
            <div>
              <p className="font-bold text-xs text-[#0F172A]">
                Chez Fanta → {currentOrder?.clientQuartier || 'Kipé'}
              </p>
              <p className="text-[11px] text-[#64748B]">
                Route Le Prince · GPS actif en direct
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-[#1E3A8A] font-bold shrink-0">
            1,4 km
          </span>
        </div>
      </div>

      {/* ⭐ SECRET 4-DIGIT DELIVERY CODE CARD (RÈGLE DE SÉCURITÉ SONEYA) */}
      <section className="p-4 rounded-2xl bg-[#FFFFFF] border-2 border-[#1E3A8A] shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A]">
            <KeyRound className="w-4 h-4 text-[#D8432F]" />
            <span>Code secret de remise en mains propres</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE3F4] text-[#1E3A8A]">
            À donner au motard
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 py-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
          {deliveryCode.split('').map((digit, i) => (
            <span
              key={i}
              className="w-11 h-12 rounded-xl bg-white border-2 border-[#1E3A8A] text-[#1E3A8A] font-headline font-black text-2xl flex items-center justify-center shadow-xs"
            >
              {digit}
            </span>
          ))}
        </div>

        <p className="text-[11px] text-[#64748B] text-center leading-relaxed">
          Le motard doit saisir ce code PIN secret sur son application pour clôturer la livraison. Ne le communiquez qu'à la réception effective de votre colis.
        </p>
      </section>

      {/* Rider Contact Card */}
      <section className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full bg-[#1E3A8A] text-white font-headline font-black text-lg flex items-center justify-center shrink-0">
            IS
          </div>
          <div className="min-w-0">
            <h2 className="font-headline font-bold text-sm text-[#0F172A] truncate">
              Ibrahima Sory Diallo
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-0.5">
              <span>Rider vérifié KYC</span>
              <span>·</span>
              <span className="flex items-center text-[#F4B028] font-bold">
                <Star className="w-3 h-3 fill-[#F4B028]" /> 4.9
              </span>
            </div>
            <p className="text-[10px] text-[#64748B]">TVS Apache · RC-9821-B</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-10 h-10 rounded-full bg-[#DCE3F4] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Envoyer un message au motard"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleCallRider}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer shadow-xs ${
              isCalling
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white'
            }`}
            title="Appeler le motard"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* In-App Direct Chat with Rider Drawer */}
      {isChatOpen && (
        <section className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-md flex flex-col gap-3 m-reveal">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-xs text-[#0F172A]">Discussion avec Ibrahima</span>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-[#64748B] hover:text-[#0F172A] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-2.5 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                    msg.sender === 'client'
                      ? 'bg-[#1E3A8A] text-white rounded-br-xs'
                      : 'bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-[#64748B] mt-0.5">{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 pt-1 border-t border-[#E2E8F0]">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Écrire au livreur (ex: portail bleu)..."
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#1E3A8A] text-[#0F172A]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold hover:bg-[#1E3A8A]/90 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>
      )}

      {/* Stepper Timeline */}
      <section className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[#64748B]">
            Statut de préparation &amp; livraison
          </h3>
          <span className="text-xs font-bold text-[#1E3A8A] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 5 min restantes
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {/* Step 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#1E3A8A]" />
              <div>
                <p className="font-bold text-xs text-[#0F172A]">Préparation en cuisine</p>
                <p className="text-[11px] text-[#64748B]">Chez Fanta · Prête et remise au coursier</p>
              </div>
            </div>
            <span className="font-mono text-xs text-[#64748B]">18:02</span>
          </div>

          {/* Step 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center animate-pulse">
                <Bike className="w-3 h-3" />
              </div>
              <div>
                <p className="font-bold text-xs text-[#1E3A8A]">Course en cours de route</p>
                <p className="text-[11px] text-[#64748B]">Arrivée estimée à votre portail</p>
              </div>
            </div>
            <span className="font-mono text-xs text-[#1E3A8A] font-bold">18:15</span>
          </div>
        </div>
      </section>

      {/* Order Amount Details */}
      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-between">
        <div>
          <span className="text-xs text-[#64748B] block">Paiement Mobile Money validé</span>
          <span className="text-xs font-bold text-[#0F172A]">
            {currentOrder?.paymentMethod === 'orange_money' ? 'Orange Money Guinée' : 'MTN MoMo'}
          </span>
        </div>
        <span className="font-headline font-black text-lg text-[#1E3A8A]">
          {formatGnf(currentOrder?.totalGnf || 80000)}
        </span>
      </div>
    </div>
  );
};
