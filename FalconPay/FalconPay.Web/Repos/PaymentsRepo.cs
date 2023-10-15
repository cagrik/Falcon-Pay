using FalconPay.Web.DB;

namespace FalconPay.Web.Repos
{
    public class PaymentsRepo
    {
        private DevkodContext db;
        public PaymentsRepo()
        {
            db = new DevkodContext();
        }
        public bool Add(Payment payment)
        {
            db.Payments.Add(payment);
            var result=db.SaveChanges();
            return result>0?true:false;
        }
        public void Update(Payment payment) {
            db.Entry(payment).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            db.SaveChanges();
        }
        public void Delete(Payment payment)
        {
            db.Remove(payment);
            db.SaveChanges();
        }
        public Payment Get(int id)
        {
            var payment= db.Payments.SingleOrDefault(x=>x.Id==id);
            return payment;
        }
        public List<Payment> GetAll()
        {
            var payments = db.Payments.ToList();
            return payments;
        }
        public List<Payment> GetAllActive()
        {
            var payments = db.Payments.Where(x=>x.Status==false).ToList();
            return payments;
        }

    }
}
