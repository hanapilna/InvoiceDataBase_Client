import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {apiGet, apiPost, apiPut} from "../utils/api";
import InputField from "../components/InputField";
import FlashMessage from "../components/FlashMessage";
import InputSelect from "../components/InputSelect";

const InvoiceForm = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [invoice, setInvoice] = useState({
        invoiceNumber: 0,
        seller: {_id: ""},
        buyer: {_id: ""},
        issued: "",
        dueDate: "",
        product: "",
        price: 0,
        vat: 0,
        note: ""
    });
    const [sentState, setSent] = useState(false);
    const [successState, setSuccess] = useState(false);
    const [errorState, setError] = useState(null);
    const [persons, setPersons] = useState([]);
    const readOnly = true;
    
    useEffect(() => {
        if (id) {
            apiGet("/api/invoices/" + id).then((data) => setInvoice(data));
        }
        apiGet("/api/persons").then((data) => setPersons(data));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        (id ? apiPut("/api/invoices/" + id, invoice) : apiPost("/api/invoices", invoice))
            .then(() => {
                setSent(true);
                setSuccess(true);
                const timer = setTimeout(() => {
                    navigate("/invoices");
                }, 1000);
                return () => clearTimeout(timer);
            })
            .catch((error) => {
                console.log(error.message);
                setError(error.message);
                setSent(true);
                setSuccess(false);
            }); 
    };

    const sent = sentState;
    const success = successState;

    return (
        <div>
            <h1>{id ? "Upravit" : "Vytvořit"} fakturu</h1>
            <hr/>
            {errorState ? (
                <div className="alert alert-danger">{errorState}</div>
            ) : null}
            {sent && (
                <FlashMessage
                    theme={success ? "success" : ""}
                    text={success ? "Uložení faktury proběhlo úspěšně." : ""}
                />
            )}
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col">
                        <InputField
                            required={true}
                            type="number"
                            name="invoiceNumber"
                            label="Číslo faktury"
                            prompt="Zadejte číslo faktury"
                            value={invoice.invoiceNumber}
                            handleChange={(e) => {
                                setInvoice({...invoice, invoiceNumber: e.target.value});
                            }}
                        />
               
                        {id? (
                            <>
                                <InputField
                                    required={true}
                                    type="text"
                                    name="seller"
                                    label="Dodavatel"
                                    value={invoice.seller?.name}
                                    readOnly={readOnly}
                                />
                                <InputField
                                    required={true}
                                    type="text"
                                    name="buyer"
                                    label="Odběratel"
                                    value={invoice.buyer?.name}
                                    readOnly={readOnly}
                                />
                            </>
                        ):(
                            <>
                                <InputSelect
                                    required={true}                 
                                    name="seller"
                                    label="Dodavatel"
                                    prompt="Vyberte dodavatele"
                                    value={invoice.seller._id}
                                    items={persons}
                                    handleChange={(e) => {
                                            setInvoice({...invoice, seller:{_id: e.target.value}});
                                        }}
                                />
                                <InputSelect   
                                    required={true}             
                                    name="buyer"
                                    label="Odběratel"
                                    prompt="Vyberte odběratele"
                                    value={invoice.buyer._id}
                                    items={persons}
                                    handleChange={(e) => {
                                            setInvoice({...invoice, buyer:{_id: e.target.value} });
                                        }}
                                />
                            </>
                        )}
                        
                        <InputField
                            required={true}
                            type="date"
                            name="issued"
                            min="0000-01-01"
                            label="Vystaveno"
                            prompt="Zadejte datum vystavení faktury"
                            value={invoice.issued}
                            handleChange={(e) => {
                                setInvoice({...invoice, issued: e.target.value});
                            }}
                        />

                        <InputField
                            required={true}
                            type="date"
                            name="dueDate"
                            min="0000-01-01"
                            label="Splatnost"
                            prompt="Zadejte splatnost faktury"
                            value={invoice.dueDate}
                            handleChange={(e) => {
                                setInvoice({...invoice, dueDate: e.target.value});
                            }}
                        />
                    </div>
                    <div className="col">
                        <InputField
                            required={true}
                            type="text"
                            name="product"
                            min="3"
                            label="Produkt"
                            prompt="Zadejte produkt"
                            value={invoice.product}
                            handleChange={(e) => {
                                setInvoice({...invoice, product: e.target.value});
                            }}
                        />

                        <InputField
                            required={true}
                            type="number"
                            name="price"
                            label="Cena"
                            prompt="Zadejte cenu"
                            value={invoice.price}
                            handleChange={(e) => {
                                setInvoice({...invoice, price: e.target.value});
                            }}
                        />

                        <InputField
                            required={true}
                            type="number"
                            name="vat"
                            label="VAT"
                            prompt="Zadejte VAT"
                            value={invoice.vat}
                            handleChange={(e) => {
                                setInvoice({...invoice, vat: e.target.value});
                            }}
                        />

                        <InputField
                            required={true}
                            type="text"
                            name="note"
                            min="3"
                            label="Poznámka"
                            prompt="Zadejte poznámku"
                            value={invoice.note}
                            handleChange={(e) => {
                                setInvoice({...invoice, note: e.target.value});
                            }}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col offset-11 text-end">
                        <input type="submit" className="btn btn-outline-primary" value="Uložit"/>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default InvoiceForm;
