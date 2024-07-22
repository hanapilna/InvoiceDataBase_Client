import React from "react";
import {Link} from "react-router-dom";

const InvoiceTable = ({label, items, deleteInvoice}) => {
  return (
      <div>
          <p>
              {label} {items.length}
          </p>
          <Link to={"/invoices/create"} className="btn btn-outline-success mb-3">
              Nová faktura
          </Link>

          <table className="table table-bordered table-hover">
              <thead>
              <tr>
                  <th>#</th>
                  <th>Číslo faktury</th>
                  <th>Dodavatel</th>
                  <th>Odběratel</th>
                  <th>Produkt</th>
                  <th>Cena v Kč</th>
                  <th colSpan={3}>Akce</th>
              </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                    <tr key={index + 1}>
                        <td>{index + 1}</td>
                        <td>{item.invoiceNumber}</td>
                        <td><Link to={"/persons/show/" + item.seller._id} className="link-success text-decoration-none"> {item.seller.name} </Link></td>
                        <td><Link to={"/persons/show/" + item.buyer._id} className="link-danger text-decoration-none"> {item.buyer.name} </Link></td>
                        <td>{item.product}</td>
                        <td>{item.price?.toLocaleString()}</td>
                        <td>
                        <div className="btn-group">
                                    <Link
                                        to={"/invoices/show/" + item._id}
                                        className="btn btn-sm btn-outline-info"
                                    >
                                        Zobrazit
                                    </Link>
                                    <Link
                                        to={"/invoices/edit/" + item._id}
                                        className="btn btn-sm btn-outline-warning"
                                    >
                                        Upravit
                                    </Link>
                                    <button
                                        onClick={() => deleteInvoice(item._id)}
                                        className="btn btn-sm btn-outline-danger"
                                    >
                                        Odstranit
                                    </button>
                                </div>
                        </td>
                    </tr>
                ))}
              </tbody>
          </table>
          
      </div>
  );
};

export default InvoiceTable;
