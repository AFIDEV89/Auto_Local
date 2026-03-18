export function parseAddress(inputString) {
  // // Split the address string into individual components
  // const addressComponents = addressString.split(',');

  // // Extract each component into its own variable
  // const streetAddress = addressComponents[0];
  // const city = addressComponents[5]?.trim();
  // const state = addressComponents[6]?.trim();
  // const zipCode = addressComponents[7];

  // // Create the address object
  // const addressObj = {
  //   streetAddress,
  //   city,
  //   state,
  //   zipCode
  // };

  // Define regular expressions for city, country, state, and pincode
  // const cityRegex = /,\s*([\w\s]+),/; // Matches comma followed by optional whitespace, then captures one or more word characters and whitespace as city
  // const countryRegex = /,\s*([\w\s]+)$/; // Matches comma followed by optional whitespace, then captures one or more word characters and whitespace at the end of the string as country
  // const stateRegex = /,\s*([\w\s]+),\s*([\w\s]+)\s+\d{6}$/; // Matches comma followed by optional whitespace, then captures one or more word characters and whitespace followed by another word character and whitespace, and finally captures 6 digits at the end of the string as state and pincode respectively

  // // Extract city, country, state, and pincode from the input string
  // const city = inputString.match(cityRegex)?.[1];
  // const country = inputString.match(countryRegex)?.[1];
  // const state = inputString.match(stateRegex)?.[1];
  // const pincode = inputString.match(stateRegex)?.[2];

  // return {
  //   city, country, state, pincode
  // };



  // 3.

  // Function to extract city, country, state, and pin code from address string
  const extractAddressDetails = (address) => {
    const parts = address.split(",");
    const cityStatePinCode = parts[parts.length - 1].trim().split(" ");
    const pinCode = cityStatePinCode.pop();
    const state = cityStatePinCode.pop();
    const country = parts[parts.length - 2]?.trim();
    const city = parts.slice(-3, -2).toString().trim();

    return {
      city,
      country,
      state,
      pinCode
    };
  };
  // Loop through each address and extract address details
  const addressDetails = extractAddressDetails(inputString);

  // Resulting array of objects with city, country, state, and pin code details
  return addressDetails;
}

export function parseDataToColumns(data) {
  const columnNames = data[0];
  const dataResponse = [];
  for (let i = 1; i < data.length; i++) {
    let json = {}
    for (let j = 0; j < columnNames.length; j++) {
      const columnName = columnNames[j].toLowerCase().replace(" ","_");;
      const cellValue = data[i][j];
      json[columnName] = cellValue
    }
    dataResponse.push(json)
  }
  return dataResponse
}
