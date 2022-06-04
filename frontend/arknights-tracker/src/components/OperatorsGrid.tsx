import { char_meta } from "../assets/char_meta";
import { char_data } from "../assets/char_data";
import { useState, useEffect, useMemo } from "react";
import { Box, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import OperatorGridImage from "./OperatorCollectionDisplay/OperatorGridImage";
import { OperatorGridOperator, OperatorFilter, OperatorFullDetails } from "../types.js";
import OperatorView from "./OperatorView";
import OperatorClassImageSelector from "./OperatorCollectionDisplay/OperatorClassImageSelector";
import OperatorRaritySelector from "./OperatorCollectionDisplay/OperatorRaritySelector";
import { cleanAlterOperatorName } from "../utils";

const OperatorsGrid = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [selectedOperator, setSelectedOperator] = useState("");
  const [operators, setOperators] = useState<OperatorGridOperator[]>([]);
  const [displayedOperators, setDisplayedOperators] = useState<
    OperatorGridOperator[]
  >([]);
  const [classFilter, setClassFilter] = useState<OperatorFilter<string>>({
    class: [],
  });
  const [rarityFilter, setRarityFilter] = useState<OperatorFilter<number>>({
    rarity: [],
  });
  const [ownedOperators, setOwnedOperators] = useState<OperatorGridOperator[]>(
    []
  );
  console.log(ownedOperators);

  useEffect(() => {
    const operatorsArray: OperatorGridOperator[] = [];
    for (const operator in char_meta) {
      char_meta[operator].forEach((operatorVersion) => {
        const operator = char_data[operatorVersion];
        operatorsArray.push({
          general: { owned: false, favourite: false },
          id: operatorVersion,
          name: cleanAlterOperatorName(operator.name),
          rarity: operator.rarity + 1,
          class: operator.profession,
          skills: operator.skills,
          potential: operator.potentialRanks,
          phases: operator.phases,
        });
      });
    }
    setOperators(operatorsArray);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedOperator) {
      onOpen();
    }
  }, [onOpen, selectedOperator]);

  const handleOperatorViewClose = () => {
    onClose()
    setSelectedOperator("")
  }

  const toggleRarity = (rarity: number) => {
    let newRarityFilter = { ...rarityFilter };
    let newRarityFilters = newRarityFilter.rarity;
    if (newRarityFilters.includes(rarity)) {
      newRarityFilter.rarity = newRarityFilters.filter(
        (item) => item !== rarity
      );
    } else {
      newRarityFilters.push(rarity);
    }
    setRarityFilter(newRarityFilter);
  };

  const toggleClass = (key: string): any => {
    let newClassFilter = { ...classFilter };
    let newClassFilters = newClassFilter.class;
    if (newClassFilters.includes(key)) {
      console.log("reached");
      newClassFilter.class = newClassFilters.filter((item) => item !== key);
    } else {
      newClassFilters.push(key);
    }
    setClassFilter(newClassFilter);
  };

  useMemo(() => {
    const filters = [classFilter, rarityFilter];
    let operatorsCopy = [...operators];
    filters.forEach((filter) => {
      operatorsCopy = [...operatorsCopy].filter((operator) => {
        const key = Object.keys(filter)[0];
        const operatorFilters: (string | number)[] = filter[key];
        const operatorValue = operator[key as keyof OperatorGridOperator];
        if (
          operatorFilters.length > 0 &&
          (typeof operatorValue === "string" ||
            typeof operatorValue === "number")
        ) {
          return operatorFilters.includes(operatorValue);
        } else {
          return true;
        }
      });
      operatorsCopy.sort(
        (operator1, operator2) => operator2.rarity - operator1.rarity
      );
      setDisplayedOperators(operatorsCopy);
    });
  }, [classFilter, rarityFilter, operators]);

  const addOperator = (operatorData : OperatorFullDetails) => {
    console.log(operatorData)
    let newOwnedOperators = [...ownedOperators];
    if (
      newOwnedOperators.find(
        (ownedOperator) => ownedOperator.name === operatorData.name
      )
    ) {
      newOwnedOperators = newOwnedOperators.filter(
        (operator) => operator.name !== operatorData.name
      );
    } else {
      const newOperator = operators.find(
        (operator) => operator.name === operatorData.name
      );
      console.log(newOperator);
      if (newOperator) {
        newOwnedOperators.push(newOperator);
      }
    }
    setOwnedOperators(newOwnedOperators);
  };

  return !loading ? (
    <div>
      <Box mb="10">
        <OperatorClassImageSelector
          classFilter={classFilter}
          toggleClass={toggleClass}
        />
        <br />
        <OperatorRaritySelector
          rarityFilter={rarityFilter}
          toggleRarity={toggleRarity}
        />
      </Box>
      <Grid templateColumns="repeat(auto-fit, 90px)" gap={1} ml={8} p={15}>
        <OperatorView
          operator={selectedOperator}
          ownedOperators={ownedOperators}
          addOperator={addOperator}
          isOpen={isOpen} 
          handleOperatorViewClose={handleOperatorViewClose}
        />
        {displayedOperators.map((operator) => (
          <GridItem
            key={operator.id}
            onClick={() => setSelectedOperator(operator.id)}
          >
            <OperatorGridImage
              ownedOperators={ownedOperators}
              operator={operator}
              selectedOperator={selectedOperator}
            />
          </GridItem>
        ))}
      </Grid>
    </div>
  ) : null;
};

export default OperatorsGrid;
