import React, {useEffect, useState} from "react";
import {apiDelete, apiGet} from "../utils/api";
import InvoiceTable from "./InvoiceTable";
import InvoiceFilter from "./InvoiceFilter";
import FlashMessage from "../components/FlashMessage";
import Pagination from "../components/Pagination";

const InvoiceIndex = () => {
    const [invoices, setInvoices] = useState([]);
    const [persons, setPersons] = useState([]);
    const [filter, setFilter] = useState({
        limit: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        product: undefined,
        buyerID: undefined, 
        sellerID: undefined
    });

    const[deleted, setDeleted] = useState(false);
    const[success, setSuccess] = useState(false);

    useEffect(() => {
        apiGet("/api/invoices").then((data) => setInvoices(data));
        apiGet("/api/persons").then((data) => setPersons(data));
    }, []);

    const deleteInvoice = async (id) => {
        const confirmDelete = confirm("Opravdu si přejete fakturu smazat?");
        if(confirmDelete){
            try {
                await apiDelete("/api/invoices/" + id);
                setDeleted(true);
                setSuccess(true);
                
            } catch (error) {
                console.log(error.message);
                alert(error.message)
            }
            setInvoices(invoices.filter((item) => item._id !== id));
            const timer = setTimeout(() => {
                setDeleted(false);
                setSuccess(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    };

    const handleChange = (e) => {
        if (e.target.value === "false" || e.target.value === "true" || e.target.value === '') {
            setFilter(prevState => {
                return {...prevState, [e.target.name]: undefined}
            });
        } else {
            setFilter(prevState => {
                return { ...prevState, [e.target.name]: e.target.value}
            });
        }
      };

      const handleSubmit = async (e) => {
          e.preventDefault();
          const params = filter;
          const data = await apiGet("/api/invoices", params);
          setInvoices(data);
      };
      
    const[currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastRecord = currentPage * itemsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
    const currentInvoices = invoices.slice(indexOfFirstRecord, indexOfLastRecord);
    
    return (
        <div>
            {persons? 
                (
                    <InvoiceFilter
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        filter={filter}
                        persons={persons}
                    />
                ):(<p>Načítám...</p>)}
            
            {invoices? 
                (   <>
                    {deleted && (
                        <FlashMessage
                            theme={success ? "primary" : ""}
                            text={success ? "Smazání faktury proběhlo úspěšně." : ""}
                            className="my-2"
                        />
                    )}
                    <h1>Seznam faktur</h1>
                    <InvoiceTable
                        deleteInvoice={deleteInvoice}
                        items={currentInvoices}
                        label="Počet zobrazených faktur:"
                    />
                    <Pagination
                        data={invoices}
                        itemsPerPage={itemsPerPage}
                        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
                        curentPage={currentPage}
                    />
                    </>
                ):(<p>Načítám...</p>)}
        </div>
    );
};
export default InvoiceIndex;