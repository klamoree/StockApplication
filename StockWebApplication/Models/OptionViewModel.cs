using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StockWebApplication.Models
{
    public class OptionViewModel
    {
        public int OptionID { get; set; }
        public int OptionTypeID { get; set; }
        public string OptionTypeKey { get; set; }
        public decimal StockPrice { get; set; }
        public decimal StrikePrice { get; set; }
        public decimal OptionPrice { get; set; }
        public int Quantity { get; set; }
        public DateTime ExpirationDate { get; set; }
        public DateTime CreatedDateTime { get; set; }
    }
}