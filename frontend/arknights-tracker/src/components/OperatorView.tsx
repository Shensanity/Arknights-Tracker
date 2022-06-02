import { Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Flex } from "@chakra-ui/react"
import { char_data } from "../assets/char_data";
import { OperatorGridOperator } from "../types";
import { cleanOperatorString } from "../utils";
import OperatorClassImage from "./OperatorClassImage";
import OperatorImage from "./OperatorImage";


interface OperatorViewProps {
  isOpen: boolean,
  onClose: () => void,
  operator: string,
  operators: OperatorGridOperator[];
  setSelectedOperator: React.Dispatch<React.SetStateAction<string>>;
  setOwnedOperators: React.Dispatch<React.SetStateAction<OperatorGridOperator[]>>;
  ownedOperators: OperatorGridOperator[];
}
const OperatorView = ({operators, operator, isOpen, onClose, setSelectedOperator, setOwnedOperators, ownedOperators} : OperatorViewProps) => {
  const operatorData = char_data[operator]
  const handleClose = () => {
    onClose()
    setSelectedOperator("")
  }
  const addOperator = () => {
    let newOwnedOperators = [...ownedOperators]
    if (newOwnedOperators.find((ownedOperator) => ownedOperator.name === operatorData.name)) {
      newOwnedOperators = newOwnedOperators.filter((operator) => operator.name !== operatorData.name)
    } else {
      const newOperator = operators.find((operator) => operator.name === operatorData.name)
      if (newOperator) {
        newOwnedOperators.push(newOperator)
      }
    }
    setOwnedOperators(newOwnedOperators)
  }
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent mt={[0, 350]}>
          <ModalHeader>
            <Flex>
              {operatorData?.name}
              <OperatorImage id={operator} name={operatorData?.name}/>
            </Flex>
          
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <p>{cleanOperatorString(operatorData?.description)}</p>
              <p>{operatorData?.position}</p>
              <p>{operatorData?.profession}</p>
              <OperatorClassImage className={operatorData?.profession}/>
              <Button onClick={addOperator}>Add Operator</Button>
            </Box>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}

export default OperatorView