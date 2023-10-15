using System;
using System.Collections.Generic;

namespace FalconPay.Web.DB;

public partial class SplToken
{
    public int Id { get; set; }

    public string TokenName { get; set; } = null!;

    public string TokenAddress { get; set; } = null!;

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
