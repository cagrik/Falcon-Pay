namespace FalconPay.Web.Models
{
    public class PaymentModel
    {
        public string RecipientWallet { get; set; }
        public string RequestedAmount { get; set; }
        public bool IsSplToken{ get; set; }
        public string TokenAddress { get; set; }
        public string RefKey { get; set; }
        public string TransferUrl { get; set; }
    }
}
