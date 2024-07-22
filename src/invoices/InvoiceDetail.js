import React, {useEffect, useState} from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import {apiGet, apiDelete} from "../utils/api";
import dateStringFormatter from "../utils/dateStringFormatter";
import FlashMessage from "../components/FlashMessage";


const InvoiceDetail = () => {
  const {id} = useParams();
  const [invoice, setInvoice] = useState({});
  const [success, setSuccess] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const navigate = useNavigate();
    
  useEffect(()=>{
    async function fetchInvoice(){
      try{
        const data = await apiGet("/api/invoices/" + id);
        setInvoice(data);
      }catch(error){
        console.log(error.message);
        setErrorState(error.message);
        const timer = setTimeout(() => {
          navigate("/invoices")
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
    fetchInvoice();
  }, [id]);

  const deleteInvoice = async (id) => {
    const confirmDelete = confirm("Opravdu si přejete fakturu smazat?");

    if(confirmDelete){
        try {
            await apiDelete("/api/invoices/" + id);
            setDeleted(true);
            setSuccess(true);
            const timer = setTimeout(() => {
              navigate("/invoices")
          }, 1000);
          return () => clearTimeout(timer);
            
        } catch (error) {
            console.log(error.message);
            alert(error.message)
            setErrorState(error.message);
            setSuccess(false);
        }
        setInvoices(invoices.filter((item) => item._id !== id));
        const timer = setTimeout(() => {
            setDeleted(false);
            setSuccess(false);
        }, 2000);
        return () => clearTimeout(timer);
    }
  };

  return (
    <>
      {errorState ? (<div className="alert alert-danger">{errorState}</div>) : null}
      {deleted && (<FlashMessage theme={success ? "primary" : ""} text={success ? "Smazání faktury proběhlo úspěšně." : ""} className="my-5"/>)}
      {invoice ? 
        (
          <div>
            <h1>Detail faktury</h1>
            <hr/>
            <h3>
              Faktura číslo: {invoice.invoiceNumber} ({invoice.product})
              <Link to={"/invoices/edit/" + invoice._id} className="btn btn-sm btn-outline-warning mx-2">Upravit</Link>
              <button onClick={() => deleteInvoice(invoice._id)} className="btn btn-sm btn-outline-danger">Odstranit</button>
            </h3>
            <p>
              <strong>Vystaveno dne</strong>
              <br/>
              {dateStringFormatter(invoice.issued, true)}
            </p>
            <p>
              <strong>Splatnost</strong>
              <br/>
              {dateStringFormatter(invoice.dueDate, true)}
            </p>
            <p>
              <strong>Cena</strong>
              <br/>
              {invoice.price?.toLocaleString()} Kč
            </p>
            <p>
              <strong>Daň</strong>
              <br/>
              {invoice.vat} %
            </p>
            <p>
              <strong>Dodavatel</strong>
              <br/>
              {invoice.seller?.name}
            </p>
            <p>
              <strong>Odeběratel</strong>
              <br/>
              {invoice.buyer?.name}
            </p>
          </div>
        )
        :
        (<div>Načítám...</div>)
      }
    </>
  )

}

export default InvoiceDetail;