import React, {useEffect, useState} from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import FlashMessage from "../components/FlashMessage";
import {apiGet, apiDelete} from "../utils/api";
import Country from "./Country";
import InvoiceTableForPersonDetail from "../invoices/InvoiceTableForPersonDetail";
import Pagination from "../components/Pagination";

const PersonDetail = () => {
    const {id} = useParams();
    const [person, setPerson] = useState({});
    const [purchases, setPurchases] = useState([]);
    const [sales, setSales] = useState([]);
    const navigate = useNavigate();
    const [deleted, setDeleted] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorState, setErrorState] = useState(null);

    useEffect(()=>{
        async function fetchPerson(){
            try{
                const data = await apiGet("/api/persons/" + id);
                setPerson(data);
            }catch(error){
                console.log(error.message);
                setErrorState(error.message);
                const timer = setTimeout(() => {
                    navigate("/persons")
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
        fetchPerson();
    }, [id]);

    if(person){
        useEffect(()=>{
                apiGet("/api/identification/" + id + "/sales").then((data) => setSales(data));
                apiGet("/api/identification/" + id + "/purchases").then((data) => setPurchases(data));
            },[id]
        )
    }

    const deletePerson = async (id) => {
        const confirmDelete = confirm("Opravdu si přejete osobu smazat?");
        if(confirmDelete){
            try {
                await apiDelete("/api/persons/" + id);
                setDeleted(true);
                setSuccess(true);
                const timer = setTimeout(() => {
                    navigate("/persons")
                }, 1000);
                return () => clearTimeout(timer);
                
            } catch (error) {
                console.log(error.message);
                alert(error.message);
                setErrorState(error.message);
                setSuccess(false);
            }
        }         
    };
    
    const itemsPerPage = 5;
    
    const[currentPagePurchases, setCurrentPagePurchases] = useState(1); 
    const indexOfLastPurchaseRecord = currentPagePurchases * itemsPerPage;
    const indexOfFirstPurchaseRecord = indexOfLastPurchaseRecord - itemsPerPage;
    const currentPurchases = purchases.slice(indexOfFirstPurchaseRecord, indexOfLastPurchaseRecord);

    const[currentPageSales, setCurrentPageSales] = useState(1); 
    const indexOfLastSaleRecord = currentPageSales * itemsPerPage;
    const indexOfFirstSaleRecord = indexOfLastSaleRecord - itemsPerPage;
    const currentSales = sales.slice(indexOfFirstSaleRecord, indexOfLastSaleRecord);

    const country = Country.CZECHIA === person.country ? "Česko" : "Slovensko";
   
    return (
        <>   
            {person? (
                <>
                <div>
                <h1>Detail osoby</h1> 
                <hr/>
                {errorState ? (<div className="alert alert-danger">{errorState}</div>) : null}
                {deleted && (
                    <FlashMessage
                        theme={success ? "primary" : ""}
                        text={success ? "Smazání osoby proběhlo úspěšně." : ""}
                        className="my-5"
                    />
                )}
                <h3>
                    {person.name} ({person.identificationNumber}) 
                    <Link to={"/persons/edit/" + person._id} className="btn btn-sm btn-outline-warning mx-2">Upravit</Link>
                    <Link to={"/persons/history/" + person._id} className="btn btn-sm btn-outline-primary">Historie změn</Link>
                    <button onClick={() => deletePerson(person._id)} className="btn btn-sm btn-outline-danger mx-2">Odstranit</button>
                </h3>
                
                <p>
                    <strong>DIČ:</strong>
                    <br/>
                    {person.taxNumber}
                </p>
                <p>
                    <strong>Bankovní účet:</strong>
                    <br/>
                    {person.accountNumber}/{person.bankCode} ({person.iban})
                </p>
                <p>
                    <strong>Tel.:</strong>
                    <br/>
                    {person.telephone}
                </p>
                <p>
                    <strong>Mail:</strong>
                    <br/>
                    {person.mail}
                </p>
                <p>
                    <strong>Sídlo:</strong>
                    <br/>
                    {person.street}, {person.city},
                    {person.zip}, {country}
                </p>
                <p>
                    <strong>Poznámka:</strong>
                    <br/>
                    {person.note}
                </p>
                </div>
                {(purchases && sales) ? 
                    (<>
                        <div>
                            <h5>Přijaté faktury</h5>
                            <hr/>
                            
                            <InvoiceTableForPersonDetail 
                                items={currentPurchases}
                                label={"Celkový počet přijatých faktur: " + purchases?.length}
                                invoicesType={"buyer"}
                            />
                            <Pagination
                                data={purchases}
                                itemsPerPage={itemsPerPage}
                                onPageChange={(pageNumber) => setCurrentPagePurchases(pageNumber)}
                                curentPage={currentPagePurchases}
                            />
                        </div>
                        <div>
                            <h5>Vystavené faktury</h5>
                            <hr/>
                            <InvoiceTableForPersonDetail 
                                items={currentSales} 
                                label={"Celkový počet vystavených faktur: " + sales?.length}
                                invoicesType={"seller"}
                            />
                            <Pagination
                                data={sales}
                                itemsPerPage={itemsPerPage}
                                onPageChange={(pageNumber) => setCurrentPageSales(pageNumber)}
                                curentPage={currentPageSales}
                            />
                        </div>
                    </>
                    ):(<p>Načítám...</p>)} 
                </>
            ):(<p>Načítám...</p>)}            
        </>
    );
};

export default PersonDetail;
