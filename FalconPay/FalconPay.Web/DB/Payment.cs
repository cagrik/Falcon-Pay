using System;
using System.Collections.Generic;

namespace FalconPay.Web.DB;

public partial class Payment
{
    public int Id { get; set; }

    public string RecieverWallet { get; set; } = null!;

    public string SenderWallet { get; set; } = null!;

    public string RequestedAmount { get; set; } = null!;

    public bool Status { get; set; }

    public int SplTokenId { get; set; }

    public string Link { get; set; } = null!;

    public virtual SplToken SplToken { get; set; } = null!;
}
