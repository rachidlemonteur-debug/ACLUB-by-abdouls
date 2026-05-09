import React, { useState, useEffect } from 'react';
import { Star, StarHalf, User } from 'lucide-react';
import { getProductReviews, addReview } from '../../services/firebaseService';

interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ authorName: '', rating: 5, comment: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await getProductReviews(productId);
      setReviews(data as Review[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.authorName || !formData.comment) return;
    
    setSubmitting(true);
    try {
      await addReview(productId, formData);
      setFormData({ authorName: '', rating: 5, comment: '' });
      setShowForm(false);
      await loadReviews();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "button"}
            disabled={!interactive}
            onClick={() => interactive && setFormData({ ...formData, rating: star })}
            className={`focus:outline-none ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                star <= rating ? 'fill-brand-kaki text-brand-kaki' : 'fill-transparent text-[#333]'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="w-full border-t border-[#333] pt-16 pb-24 px-6 md:px-12 lg:px-24 bg-brand-noir">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-widest text-brand-blanc mb-4">
              Avis Clients
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-mono text-brand-kaki font-bold">
                  {averageRating > 0 ? averageRating.toFixed(1) : '-'}
                </span>
                <div className="flex flex-col gap-1">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-[10px] text-brand-gris uppercase tracking-widest">
                    {reviews.length} {reviews.length > 1 ? 'avis' : 'avis'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="border border-[#333] text-brand-blanc hover:border-brand-kaki hover:text-brand-kaki transition-colors px-6 py-3 text-[10px] font-bold uppercase tracking-widest"
          >
            {showForm ? 'Annuler' : 'Laisser un avis'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-12 bg-[#0a0a0a] border border-[#222] p-6 lg:p-8">
            <h3 className="text-xs font-bold text-brand-gris uppercase tracking-widest mb-6">Nouvel avis</h3>
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-bold text-brand-gris uppercase tracking-widest mb-2">Note</label>
                {renderStars(formData.rating, true)}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-brand-gris uppercase tracking-widest mb-2">Votre nom</label>
                <input
                  type="text"
                  required
                  value={formData.authorName}
                  onChange={e => setFormData({ ...formData, authorName: e.target.value })}
                  className="w-full bg-[#111] border border-[#333] text-brand-blanc px-4 py-3 text-sm focus:outline-none focus:border-brand-kaki transition-colors"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-brand-gris uppercase tracking-widest mb-2">Votre avis</label>
                <textarea
                  required
                  rows={4}
                  value={formData.comment}
                  onChange={e => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full bg-[#111] border border-[#333] text-brand-blanc px-4 py-3 text-sm focus:outline-none focus:border-brand-kaki transition-colors resize-none"
                  placeholder="Partagez votre expérience avec ce produit..."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-kaki text-brand-noir py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-[#7a8a5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Envoi en cours...' : 'Publier mon avis'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-kaki"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 border border-[#222] bg-[#0a0a0a]">
            <p className="text-brand-gris text-sm mb-4">Aucun avis pour le moment.</p>
            <p className="text-brand-blanc text-xs uppercase tracking-widest font-bold">Soyez le premier à donner votre avis !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-[#0a0a0a] border border-[#222] p-6 lg:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#111] border border-[#333] flex items-center justify-center">
                      <User className="w-4 h-4 text-brand-gris" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-blanc mb-0.5">{review.authorName}</h4>
                      <div className="text-[10px] text-brand-gris font-mono">
                        {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p className="text-brand-blanc/80 font-sans text-sm leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
