import React from "react";
import dateStringFormatter from "../utils/dateStringFormatter";
import {Link} from "react-router-dom";
import Country from "./Country";

const PersonHistoryTable = ({label, items, country}) => {
  return (
      <div>
          <p>
              {label}
          </p>
          
          <table className="table table-bordered table-hover">
              <thead>
              <tr>
                  <th>#</th>
                  <th>Datum změny</th>
                  <th>Jméno</th>
                  <th>IČO</th>
                  <th>DIČ</th>
                  <th>Číslo účtu</th>
                  <th>Telefon</th>
                  <th>Email</th>
                  <th>Sídlo</th>
                  <th>Poznámka</th>
              </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                    <tr key={index + 1}>
                        <td>{index + 1}</td>
                        <td>{dateStringFormatter(item.created, true)}</td>
                        <td>{item.name}</td>
                        <td>{item.identificationNumber}</td>
                        <td>{item.taxNumber}</td>
                        <td>{item.accountNumber}/{item.bankCode} ({item.iban})</td>
                        <td>{item.telephone}</td>
                        <td>{item.mail}</td>
                        <td>{item.street} {item.city} {country} {item.zip}</td>
                        <td>{item.note}</td>
                        
                    </tr>
                ))}
              </tbody>
          </table>
          
      </div>
  );
};

export default PersonHistoryTable;