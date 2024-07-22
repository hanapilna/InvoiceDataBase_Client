import InputField from "../components/InputField";
import InputSelect from "../components/InputSelect";

const InvoiceFilter = (props) => {
  const handleChange = (e) => {
    props.handleChange(e);
  };

  const handleSubmit = (e) => {
      props.handleSubmit(e);
  };

  const filter = props.filter;

  return(
    <>
      <form onSubmit={handleSubmit} className="my-3">
        <div className="row my-3">
          <div className="col-6">
            <InputSelect
              required={false}
              name="seller"
              label="Dodavatel"
              items={props.persons}
              value={filter.sellerID}
              handleChange={handleChange}
              prompt="Vyberte dodavatele"
            /> 
            <InputSelect
              required={false}
              name="buyer"
              label="Odběratel"
              items={props.persons}
              value={filter.buyerID}
              handleChange={handleChange}
              prompt="Vyberte odběratele"
            />
            <InputField
              required={false}
              type="text"
              name="product"
              label="Produkt/služba"
              value={filter.product ? filter.product : ''}
              handleChange={handleChange}
              prompt="Zadejte produkt/službu"
            />
          </div>
          <div className="col-6">
            <InputField
              required={false}
              type="number"
              name="minPrice"
              label="Minimální cena"
              value={filter.minPrice ? filter.minPrice : ''}
              handleChange={handleChange}
              prompt="Zadejte minimální cenu"
            />
            <InputField
              required={false}
              type="number"
              name="maxPrice"
              label="Maximální cena"
              value={filter.maxPrice ? filter.maxPrice : ''}
              handleChange={handleChange}
              prompt="Zadejte maximální cenu"
            />
            <InputField
              required={false}
              type="number"
              name="limit"
              label="Počet záznamů"
              value={filter.limit ? filter.limit : ''}
              handleChange={handleChange}
              prompt="Zadejte počet požadovaných záznamů"
            />      
          </div>
        </div>
        <div className="row">
            <div className="col">
                <input
                    type="submit"
                    className="btn btn-outline-primary"
                    value="Filtruj"
                />
                <button className="btn btn-outline-warning mx-2" onClick={()=>{window.location.reload()}}>Zruš filtr</button>
            </div>
        </div>
      </form>
    </>
  );
}

export default InvoiceFilter;