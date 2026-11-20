import React from 'react';
import { CourierApplication } from '../../types';
import { Shield, Lock, FileCheck, CheckCircle2, User, Phone, MapPin, Calendar, AlertTriangle } from 'lucide-react';

interface DocumentSpecimenViewerProps {
  application: CourierApplication;
  documentType: 'cni' | 'carte_grise' | 'certificat_residence' | 'selfie' | 'charter';
}

export const DocumentSpecimenViewer: React.FC<DocumentSpecimenViewerProps> = ({
  application,
  documentType,
}) => {
  const { documents, charter, fullName } = application;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#19523B] bg-[#081C13] text-white select-none">
      {/* Privacy Watermark */}
      <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center opacity-15 rotate-[-25deg]">
        <div className="text-center font-mono font-black text-xs sm:text-sm tracking-widest text-emerald-400 uppercase leading-loose border-2 border-dashed border-emerald-400 p-4 rounded-xl">
          CONFIDENTIEL · GHT GUINÉE · SONEYA ADMIN KYC ONLY<br />
          NE PAS DIFFUSER · STORAGE PRIVÉ CHIFFRÉ
        </div>
      </div>

      {/* Top Security Banner */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#04100A]/80 border-b border-white/10 text-[10px]">
        <div className="flex items-center gap-1.5 text-emerald-400 font-mono min-w-0 truncate">
          <Lock className="w-3 h-3 shrink-0" />
          <span className="truncate">bucket: storage.private/kyc-couriers/{application.courierId}</span>
        </div>
        <span className="font-semibold text-emerald-100/80 shrink-0">Specimen Sécurisé</span>
      </div>

      {/* Document Content View */}
      <div className="p-4 sm:p-5 relative z-10 min-h-[240px] flex flex-col justify-center">
        {documentType === 'cni' && (
          <div className="space-y-4">
            {/* CNI Recto */}
            <div className="p-3.5 rounded-xl bg-[#0D2B1E] border border-[#1B4D38] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1B4D38] pb-2 mb-3 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-md bg-white text-[#0B2B1E] flex items-center justify-center text-[10px] font-bold shrink-0">
                    GN
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-white truncate">
                      RÉPUBLIQUE DE GUINÉE
                    </div>
                    <div className="text-[9px] text-emerald-200/70 truncate">CARTE NATIONALE D'IDENTITÉ BIOMÉTRIQUE</div>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-emerald-200 shrink-0">RECTO</span>
              </div>

              <div className="flex flex-col xs:flex-row sm:flex-row gap-3">
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#123A29] border border-[#1B4D38] shrink-0">
                  <img src={documents.selfiePhotoUrl} alt="Photo CNI" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 text-[11px] min-w-0">
                  <div>
                    <span className="text-[9px] text-emerald-200/70 block uppercase">Nom / Prénoms</span>
                    <strong className="text-white text-xs">{fullName}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-emerald-200/70 block uppercase">N° CNI Biométrique</span>
                    <strong className="text-white font-mono">{documents.cniNumber}</strong>
                  </div>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <div>
                      <span className="text-[9px] text-emerald-200/70 block uppercase">Nationalité</span>
                      <strong className="text-emerald-100">Guinéenne</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-emerald-200/70 block uppercase">Résidence</span>
                      <strong className="text-emerald-100">{application.quartier} (Conakry)</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#1B4D38] font-mono text-[9px] text-emerald-200/60 tracking-widest truncate">
                IDGIN&lt;&lt;{documents.cniNumber.replace(/[^A-Z0-9]/g, '')}&lt;&lt;&lt;&lt;&lt;&lt;&lt;9201014M3006158GIN&lt;&lt;&lt;&lt;&lt;&lt;&lt;02
              </div>
            </div>

            {/* CNI Verso */}
            <div className="p-3 rounded-xl bg-[#0D2B1E] border border-[#1B4D38] text-[10px] space-y-2">
              <div className="flex items-center justify-between text-emerald-200/70">
                <span className="uppercase font-semibold text-[9px]">VERSO CNI · PUCE & SIGNATURE OFFICIELLE</span>
                <span className="text-emerald-100 font-mono">VERSO</span>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-2 text-emerald-100">
                <div>
                  <span className="text-[9px] text-emerald-200/60 block">Autorité de délivrance</span>
                  <span>Ministère de la Sécurité et de la Protection Civile</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-[9px] text-emerald-200/60 block">Validité</span>
                  <span className="text-white font-semibold">Jusqu'en Déc. 2031</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {documentType === 'carte_grise' && (
          <div className="p-4 rounded-xl bg-[#0D2B1E] border border-[#1B4D38] space-y-3">
            <div className="flex items-center justify-between border-b border-[#1B4D38] pb-2 gap-2">
              <div className="min-w-0">
                <div className="text-[10px] font-extrabold text-white uppercase truncate">
                  RÉPUBLIQUE DE GUINÉE · MINISTÈRE DES TRANSPORTS
                </div>
                <div className="text-[9px] text-emerald-200/70 truncate">DIRECTION NATIONALE DES TRANSPORTS TERRESTRES (DNTT)</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-200 font-mono shrink-0">CARTE GRISE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[9px] text-emerald-200/70 uppercase">Immatriculation</span>
                <div className="font-mono font-bold text-sm text-white bg-[#04100A]/60 px-2 py-1 rounded inline-block mt-0.5 border border-[#24664B]">
                  {documents.plateNumber}
                </div>
              </div>
              <div>
                <span className="text-[9px] text-emerald-200/70 uppercase">Titulaire</span>
                <div className="font-bold text-emerald-100 mt-0.5">{fullName}</div>
              </div>
              <div>
                <span className="text-[9px] text-emerald-200/70 uppercase">Marque & Type</span>
                <div className="font-semibold text-emerald-100">{documents.vehicleBrandModel}</div>
              </div>
              <div>
                <span className="text-[9px] text-emerald-200/70 uppercase">Genre / Catégorie</span>
                <div className="font-semibold text-emerald-100">Moto 2 Roues (MTL)</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#04100A]/40 border border-[#1B4D38] text-[10px] text-emerald-100 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>Visite technique & assurance Conakry en cours de validité</span>
            </div>
          </div>
        )}

        {documentType === 'certificat_residence' && (
          <div className="p-4 rounded-xl bg-[#0D2B1E] border border-[#1B4D38] space-y-3">
            <div className="text-center border-b border-[#1B4D38] pb-2">
              <div className="text-[9px] text-emerald-200/70 uppercase tracking-widest">RÉPUBLIQUE DE GUINÉE</div>
              <div className="text-[11px] font-extrabold text-white">VILLE DE CONAKRY · COMMUNE DE {application.quartier.toUpperCase()}</div>
              <div className="text-[9px] text-emerald-400 font-semibold">CERTIFICAT DE RÉSIDENCE OFFICIEL</div>
            </div>

            <div className="text-xs text-emerald-100 space-y-1.5 leading-relaxed">
              <p>
                Le Maire de la Commune certifie que le citoyen <strong>{fullName}</strong>, titulaire de la pièce d'identité N° <strong>{documents.cniNumber}</strong>, réside effectivement dans le quartier <strong>{application.quartier}</strong>, Ville de Conakry.
              </p>
              <p className="text-[10px] text-emerald-200/70">
                Délivré pour servir et valoir ce que de droit dans le cadre de son activité de livraison à domicile.
              </p>
            </div>

            <div className="flex flex-wrap justify-between items-end gap-2 pt-2 border-t border-[#1B4D38] text-[10px]">
              <div>
                <span className="text-emerald-200/60 text-[9px] block">Date de délivrance</span>
                <span className="text-emerald-100 font-mono">12 Avril 2026</span>
              </div>
              <div className="sm:text-right">
                <span className="text-emerald-400 font-mono text-[9px] block">Cachet de la Mairie</span>
                <span className="text-xs font-bold text-white">[CACHET ET SIGNATURE CONFORMES]</span>
              </div>
            </div>
          </div>
        )}

        {documentType === 'selfie' && (
          <div className="flex flex-col items-center justify-center space-y-3 py-2">
            <div className="relative">
              {/* Guided Oval Silhouette Frame */}
              <div className="w-32 h-40 rounded-[50%/60%] overflow-hidden border-4 border-emerald-400 shadow-xl shadow-emerald-500/20 ring-4 ring-black/50">
                <img src={documents.selfiePhotoUrl} alt="Selfie guidé" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-[#0B2B1E] font-bold shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-center space-y-0.5">
              <div className="text-xs font-extrabold text-white">{fullName}</div>
              <div className="text-[10px] text-emerald-400 flex flex-wrap items-center justify-center gap-1">
                <span>Cadrage biométrique guidé validé</span>
                <span>·</span>
                <span>Visage non obstrué</span>
              </div>
            </div>
          </div>
        )}

        {documentType === 'charter' && (
          <div className="space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="font-extrabold text-emerald-400 text-xs">
                ENGAGEMENTS & SIGNATURE DE LA CHARTE
              </div>
              <span className="text-[10px] text-emerald-200/70 font-mono">
                {new Date(charter.signedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] text-emerald-100">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Casque obligatoire</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Code de la route Conakry</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Ponctualité & suivi</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Colis scellé inviolable</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Code secret 4 chiffres</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Courtoisie client & partenaire</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#04100A]/50 border border-[#1B4D38] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[9px] text-emerald-200/70 uppercase block">Signature Numérique Enregistrée</span>
                <span className="font-mono text-[10px] text-emerald-300">Empreinte horodatée Conakry GMT</span>
              </div>
              <div className="w-36 h-12 bg-white/10 rounded-lg border border-white/20 p-1 flex items-center justify-center">
                <img src={charter.signatureDataUrl} alt="Signature" className="max-h-full max-w-full object-contain" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="relative z-10 px-4 py-2.5 bg-[#04100A]/60 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] text-emerald-200/75">
        <div className="flex items-center gap-2">
          <span>Mobile Money : <strong className="text-white">{documents.momoProvider === 'orange_money' ? 'Orange Money' : 'MTN MoMo'} ({documents.momoNumber})</strong></span>
        </div>
        <div>
          <span>Contact confiance : <strong className="text-white">{documents.emergencyContact.fullName} ({documents.emergencyContact.relationship} - {documents.emergencyContact.phone})</strong></span>
        </div>
      </div>
    </div>
  );
};
