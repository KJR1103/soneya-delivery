import React, { useState } from 'react';
import { Partner, Review } from '../../types';
import { Star, X, CheckCircle2, MessageSquarePlus } from 'lucide-react';

interface ReviewsModalProps {
  partner: Partner;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({ partner, isOpen, onClose }) => {
  const [reviews, setReviews] = useState<Review[]>(
    partner.reviews || [
      {
        id: 'rev-1',
        author: 'Mariama Camara (Kipé)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'Il y a 2 jours',
        comment: 'Le Maffé Tiga est exceptionnel ! Sauce onctueuse et la viande fondante. Livré encore fumant.',
      },
      {
        id: 'rev-2',
        author: 'Mohamed Soumah (Kaloum)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'La semaine dernière',
        comment: 'Livraison en moins de 25 minutes malgré les bouchons sur la corniche. Bravo au coursier Mamadou !',
      },
      {
        id: 'rev-3',
        author: 'Fatoumata Binta Barry (Dixinn)',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        rating: 4.8,
        date: 'Il y a 10 jours',
        comment: 'Portions généreuses, alloco doré comme il faut. Je commande chaque semaine sur Soneya.',
      },
    ]
  );

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const handleAddReview = () => {
    if (!newComment.trim()) return;
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      author: 'Moi (Client Vérifié)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: newRating,
      date: 'À l instant',
      comment: newComment.trim(),
    };
    setReviews([newRev, ...reviews]);
    setNewComment('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2B1E]/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[88dvh] rounded-3xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-2xl flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 border-b border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Star className="w-4 h-4 fill-[#FFB81F] text-[#FFB81F] shrink-0" />
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white truncate">
                Avis & Notes clients
              </h3>
              <p className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/70 truncate">{partner.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full text-[#2F4F42] hover:text-[#0B2B1E] hover:bg-emerald-50 dark:text-emerald-200/70 dark:hover:text-white flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rating summary */}
        <div className="p-4 bg-white dark:bg-[#10231B]/60 border-b border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-black text-3xl text-[#0B2B1E] dark:text-white">
                {partner.rating}
              </span>
              <span className="text-xs text-[#5C7A6E] dark:text-emerald-200/60">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#FFB81F] text-[#FFB81F]" />
              ))}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-[#0B2B1E] dark:text-emerald-100">
              {partner.reviewsCount} avis vérifiés
            </span>
            <div className="text-[10px] text-[#0B7A4B] dark:text-emerald-400 font-semibold flex items-center justify-end gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>Clients Conakry</span>
            </div>
          </div>
        </div>

        {/* Reviews list */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3.5">
          {showAddForm ? (
            <div className="p-4 rounded-2xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] space-y-3">
              <div className="text-xs font-bold text-[#0B2B1E] dark:text-white">Votre note :</div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((st) => (
                  <button
                    key={st}
                    onClick={() => setNewRating(st)}
                    className="p-1 text-[#FFB81F]"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        st <= newRating ? 'fill-[#FFB81F]' : 'stroke-[#FFB81F] fill-transparent'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Racontez votre expérience (qualité des plats, rapidité du coursier...)"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 rounded-xl bg-white dark:bg-[#0C1913] text-xs border border-[#D4E9DD] dark:border-[#1E3B2D] focus:outline-none focus:ring-2 focus:ring-[#0B7A4B] text-[#0B2B1E] dark:text-white placeholder-[#5C7A6E] resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddReview}
                  className="flex-1 min-h-[42px] py-2 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-bold text-xs shadow-xs transition"
                >
                  Publier l'avis
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100 hover:bg-emerald-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full min-h-[44px] py-2.5 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B7A4B] dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-50 dark:hover:bg-[#13291F] transition"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Donner mon avis sur {partner.name}</span>
            </button>
          )}

          <div className="divide-y divide-[#E2ECE7] dark:divide-[#1E3B2D]">
            {reviews.map((rev) => (
              <div key={rev.id} className="py-3 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-xs text-[#0B2B1E] dark:text-white truncate">
                        {rev.author}
                      </div>
                      <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/60">{rev.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs font-bold text-[#FFB81F] shrink-0">
                    <Star className="w-3.5 h-3.5 fill-[#FFB81F]" />
                    <span>{rev.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-100/80 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
