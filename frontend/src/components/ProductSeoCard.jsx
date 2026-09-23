import React from 'react';
import { ShoppingBag, Tag, Star, PackageCheck, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ProductSeoCard({ productSeo }) {
  if (!productSeo || !productSeo.is_product_page) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center backdrop-blur-md light:bg-white light:border-slate-200">
        <ShoppingBag className="h-10 w-10 text-slate-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white light:text-slate-900">
          Standard Webpage Detected
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          This URL does not appear to be an e-commerce product detail page. If this is a product, ensure Schema.org/Product JSON-LD markup or buy buttons are present.
        </p>
      </div>
    );
  }

  const {
    product_name,
    brand,
    price,
    currency,
    availability,
    sku,
    rating_value,
    review_count,
    has_product_schema,
    missing_elements,
    score
  } = productSeo;

  return (
    <div className="space-y-6">
      
      {/* Product Banner */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950/60 p-5 backdrop-blur-md light:bg-indigo-50/50 light:border-indigo-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300 uppercase">
                  E-Commerce Product Detected
                </span>
                {brand && (
                  <span className="text-xs text-slate-400">by {brand}</span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white light:text-slate-900 mt-0.5">
                {product_name || "Product Name Detected in DOM"}
              </h2>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-extrabold font-mono text-emerald-400">
              {currency === 'USD' ? '$' : currency} {price || "N/A"}
            </div>
            <div className="text-xs font-semibold text-slate-400">
              {availability || "Status Unknown"}
            </div>
          </div>
        </div>
      </div>

      {/* Product SEO Attributes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Product Schema</div>
          <div className="text-lg font-bold font-mono mt-1 flex items-center gap-1.5">
            {has_product_schema ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> JSON-LD OK
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> Missing
              </span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Customer Rating</div>
          <div className="text-lg font-bold font-mono text-amber-400 mt-1 flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {rating_value ? `${rating_value}/5 (${review_count || 0})` : 'No Reviews'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Product SKU / ID</div>
          <div className="text-lg font-bold font-mono text-cyan-400 mt-1 truncate">
            {sku || 'Not detected'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Product SEO Score</div>
          <div className="text-lg font-bold font-mono text-indigo-400 mt-1">
            {score}/100
          </div>
        </div>
      </div>

      {/* Missing E-commerce Elements */}
      {missing_elements && missing_elements.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs light:bg-amber-50 light:border-amber-200">
          <div className="font-bold text-amber-300 light:text-amber-800 mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            Missing Product Elements for Google Shopping / SERPs:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300 light:text-slate-700">
            {missing_elements.map((elem, idx) => (
              <li key={idx}>{elem}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
