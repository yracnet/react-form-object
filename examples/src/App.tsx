import { Container, Tab, Tabs } from "react-bootstrap";
import { ContactNestedTSExample } from "./contact/nestedts";
import { ContactSimpleExample } from "./contact/simplejs";
import { ContactSimpleTSExample } from "./contact/simplets";
import { ContactListSimpleTSExample } from "./contactList/simplets";

const App = () => {
  return (
    <Container fluid="xxl">
      <h1>FormObject Examples</h1>
      <Tabs defaultActiveKey="simplejs">
        <Tab eventKey="simplejs" title="Contact Plane JS Example">
          <ContactSimpleExample />
        </Tab>
        <Tab eventKey="simplets" title="Contact Plane TS Example">
          <ContactSimpleTSExample />
        </Tab>
        <Tab eventKey="nestedts" title="Contact Nested TS Example">
          <ContactNestedTSExample />
        </Tab>
        <Tab eventKey="level2" title="Contact List Simple TS Example">
          <ContactListSimpleTSExample />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default App;
