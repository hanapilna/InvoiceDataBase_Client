import PersonHistoryTable from "./PersonHistoryTable";
import React, {useEffect, useState} from "react";
import { apiGet } from "../utils/api";
import {useParams, Link, useNavigate} from "react-router-dom";
import Country from "./Country";
import Pagination from "../components/Pagination";


const PersonHistory = () => {
  const {id} = useParams();

  const [person, setPerson] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(()=>{
    apiGet("/api/persons/" + id).then((data)=>(setPerson(data)));
  },[id])

  if(person){
    const ico = person.identificationNumber;
    useEffect(()=>{
      apiGet("/api/" + ico + "/change-history").then((data)=>(setHistory(data)));
    }, [ico])
  }

  const[currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentHistory = history.slice(indexOfFirstRecord, indexOfLastRecord);

  const country = Country.CZECHIA === person.country ? "Česko" : "Slovensko";
  return (
    <>
    {history?(
      <>
        <h5>Historie změn</h5>
        <Link to={"/persons/show/" + person._id} className="btn btn-sm btn-outline-primary">Zpět na detail osoby</Link>
        <PersonHistoryTable
          items={currentHistory}
          country={country}
        />
        <Pagination
          data={history}
          itemsPerPage={itemsPerPage}
          onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          curentPage={currentPage}
        />
      </>
    ):(<p>Načítám...</p>)}
    </>
  )


}

export default PersonHistory;