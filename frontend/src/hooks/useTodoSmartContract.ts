import { IPortkeyProvider, IChain } from "@portkey/provider-types";
import { useEffect, useState } from "react";

const useTodoSmartContract = (provider: IPortkeyProvider | null) => {
  const [smartContract, setSmartContract] =
    useState<ReturnType<IChain["getContract"]>>();

  //Step A - Function to fetch a Smart Contract based on deployed wallet address
  const fetchContract = async () => {
    if (!provider) return null;

    try {
      // 1. get the sidechain tDVW using provider.getChain
      const chain = await provider?.getChain("tDVW");
      if (!chain) throw new Error("No chain");

      //Address of DAO Smart Contract
      //Replace with Address of Deployed Smart Contract
      const address = "2TUANmhCGkympiYs2wmpMY39YjZzBuodohnoDbrfBGMK9eMPAZ";

      // 2. get the DAO contract
      const todoContract = chain?.getContract(address);
      setSmartContract(todoContract);
    } catch (error) {
      console.log(error, "====error");
    }
  }

  // Step B -  Effect hook to initialize and fetch the smart contracts when the provider changes
  useEffect(() => {
    fetchContract();
  }, [provider]);  // Dependency array ensures this runs when the provider changes

  return smartContract;
};

export default useTodoSmartContract;
