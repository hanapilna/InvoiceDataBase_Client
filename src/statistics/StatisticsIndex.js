import { useEffect, useState } from "react";
import { apiGet } from "../utils/api";
import { Link } from "react-router-dom";

const StatisticsIndex = () => {
  const [personsStats, setPersonsStats] = useState([]);
  const [invoicesStats, setInvoicesStats] = useState({});
  
  useEffect(() => {
    apiGet("/api/persons/statistics").then((data)=> setPersonsStats(data));
    apiGet("/api/invoices/statistics").then((data) => setInvoicesStats(data));
  }, [])

  return(
    <>
      {invoicesStats ? 
        (
          <div>
            <h2>Statistika faktur</h2>
            <hr/>
            <div>
              <h6>Suma cen za letošní rok</h6>
              <p>{invoicesStats.currentYearSum?.toLocaleString()} Kč</p>
            </div>
            <div>
              <h6>Suma cen za celou dobu evidence</h6>
              <p>{invoicesStats.allTimeSum?.toLocaleString()} Kč</p>
            </div>
            <div>
              <h6>Počet faktur</h6>
              <p>{invoicesStats.invoicesCount?.toLocaleString()}</p>
            </div>
          </div>
        ) : (<p>Načítám...</p>)}
      
      {personsStats? 
        (
          <div>
            <h2>Statistika Osob</h2>
            <hr/>
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Jméno</th>
                  <th>Suma příjmů v Kč</th>
                  <th>Suma výdajů v Kč</th>
                </tr>
              </thead>
              <tbody>
                {personsStats.map((person) => {
                    return(
                      <tr key={person.personId}>
                        <td><Link to={"/persons/show/" + person.personId} className="text-decoration-none">{person.personName}</Link></td>
                        <td>{person?.revenue?.toLocaleString()}</td>
                        <td>{person?.expenses?.toLocaleString()}</td>
                      </tr>
                    )    
                  })
                }
              </tbody>
            </table>
          </div>
        ) : (<p>Načítám...</p>)}
    </>
   );      
}

export default StatisticsIndex;