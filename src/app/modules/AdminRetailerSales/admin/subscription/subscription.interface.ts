interface ISubscriptionPlan {
     tier: string;
     subscription: string;
     freeShipping: string;
     noCreditCardFee: string;
     exclusiveProducts: string;
     limitedReleases: string;
     termsAndConditionsAccepted: boolean;
     termsAndConditions: string;
     status: 'active' | 'inactive';
}

export default ISubscriptionPlan;
