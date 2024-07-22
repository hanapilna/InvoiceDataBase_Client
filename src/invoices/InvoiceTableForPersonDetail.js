import React from "react";
import {Link} from "react-router-dom";

const InvoiceTableForPersonDetail = ({label, items, invoicesType}) => {
  const invoicesBuyer = invoicesType === "buyer";
  
  return (
      <div>
          <p>
              {label} 
          </p>
          <table className="table table-bordered table-hover">
              <thead>
              <tr>
                  <th>#</th>
                  <th>Číslo faktury</th>
                  {invoicesBuyer? (<th>Dodavatel</th>):(<th>Odběratel</th>)}
                  <th>Produkt</th>
                  <th></th>
              </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                    <tr key={index + 1}>
                        <td>{index + 1}</td>
                        <td>{item.invoiceNumber}</td>
                        {invoicesBuyer? (<td><Link to={"/persons/show/" + item.seller._id} className="link-success text-decoration-none">{item.seller.name}</Link></td>) 
                            : (<td><Link to={"/persons/show/" + item.buyer._id} className="link-danger text-decoration-none">{item.buyer.name}</Link></td>)}
                        <td>{item.product}</td>
                        <td><Link to={"/invoices/show/" + item._id} className="btn btn-sm btn-outline-info" >Zobrazit detail faktury</Link></td>
                    </tr>
                ))}
              </tbody>
          </table>  
      </div>
  );
};

export default InvoiceTableForPersonDetail;
