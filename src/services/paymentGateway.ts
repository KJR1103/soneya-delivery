/**
 * Soneya Delivery - Service Passerelle de Paiement Mobile Money
 * Développé par Guinée Hub Technologie (GHT)
 * 
 * Support exclusif pour la République de Guinée :
 * - Orange Money Guinée (#144#)
 * - MTN Mobile Money Guinée (*440#)
 * 
 * Règle métier stricte : 100% Mobile Money.
 * Aucun paiement en espèces ni par carte bancaire.
 * Frais de transaction opérateur simulés : 2,75%.
 */

import { PaymentMethod } from '../types';

export interface PaymentInitiationRequest {
  orderId: string;
  amountGnf: number;
  phone: string;
  method: PaymentMethod;
  clientName: string;
}

export interface PaymentInitiationResponse {
  success: boolean;
  transactionId: string;
  ussdPushCode: string;
  feesGnf: number;
  netAmountGnf: number;
  message: string;
}

export interface WebhookNotification {
  transactionId: string;
  orderId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  operatorRef: string;
  timestamp: string;
  hash: string;
}

class MobileMoneyGatewayService {
  private readonly OPERATOR_FEE_PERCENT = 2.75;

  /**
   * Valide le format du numéro de téléphone guinéen (+224 6XX XX XX XX)
   */
  public isValidGuineanPhone(phone: string): boolean {
    const cleaned = phone.replace(/[\s\-\+]/g, '');
    // Standard format : 6XX XX XX XX (9 chiffres) ou 2246XXXXXXXX (11 chiffres)
    if (cleaned.startsWith('224') && cleaned.length === 11) {
      const prefix = cleaned.substring(3, 4);
      return prefix === '6';
    }
    if (cleaned.length === 9) {
      return cleaned.startsWith('6');
    }
    return false;
  }

  /**
   * Calcule les frais d'opérateur mobile money (2,75%)
   */
  public calculateOperatorFee(amountGnf: number): number {
    return Math.round((amountGnf * this.OPERATOR_FEE_PERCENT) / 100);
  }

  /**
   * Déclenche un push USSD vers le smartphone du client
   */
  public async initiatePayment(request: PaymentInitiationRequest): Promise<PaymentInitiationResponse> {
    const transactionId = `TX-GHT-${Date.now().toString(36).toUpperCase()}`;
    const feesGnf = this.calculateOperatorFee(request.amountGnf);
    const ussdCode = request.method === 'orange_money' ? '#144#' : '*440#';

    // Simulation de l'appel API REST agrégateur
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      transactionId,
      ussdPushCode: ussdCode,
      feesGnf,
      netAmountGnf: request.amountGnf,
      message: `Demande de validation ${
        request.method === 'orange_money' ? 'Orange Money (#144#)' : 'MTN MoMo (*440#)'
      } envoyée au ${request.phone}. Veuillez composer votre code PIN secret sur votre téléphone.`,
    };
  }

  /**
   * Vérifie le reçu fiscal numérique délivré par GHT
   */
  public generateReceiptNumber(orderId: string): string {
    return `REC-GHT-2026-${orderId.slice(-6).toUpperCase()}`;
  }
}

export const mobileMoneyGateway = new MobileMoneyGatewayService();
