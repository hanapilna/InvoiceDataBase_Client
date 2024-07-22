import React, {useEffect, useState} from "react";
import {apiDelete, apiGet} from "../utils/api";
import PersonTable from "./PersonTable";
import FlashMessage from "../components/FlashMessage";
import Pagination from "../components/Pagination";

const PersonIndex = () => {
    const[persons, setPersons] = useState([]);
    const[deleted, setDeleted] = useState(false);
    const[success, setSuccess] = useState(false);

    const deletePerson = async (id) => {
        const confirmDelete = confirm("Opravdu si pejete firmu/osobu smazat?");
        if(confirmDelete){
            try {
                await apiDelete("/api/persons/" + id);
                setDeleted(true);
                setSuccess(true);
            } catch (error) {
                console.log(error.message);
                alert(error.message)
            }
            setPersons(persons.filter((item) => item._id !== id));
            const timer = setTimeout(() => {
                setDeleted(false);
                setSuccess(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    };

    useEffect(() => {
        apiGet("/api/persons").then((data) => setPersons(data));
    }, []);

    const[currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastRecord = currentPage * itemsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
    const currentPersons = persons.slice(indexOfFirstRecord, indexOfLastRecord);

    return (
        <div>
            {deleted && (
                <FlashMessage
                    theme={success ? "primary" : ""}
                    text={success ? "Smazání osoby proběhlo úspěšně." : ""}
                    className="my-5"
                />
            )}
            <h1>Seznam osob</h1>
            <PersonTable
                deletePerson={deletePerson}
                items={currentPersons}
                label={"Počet osob v evidenci: " + persons?.length}
            />
            <Pagination
                data={persons}
                itemsPerPage={itemsPerPage}
                onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
                curentPage={currentPage}
            />
        </div>
    );
};
export default PersonIndex;
