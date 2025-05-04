import "./App.css";
import CalendarComponent from "./components/CalendarComponent";
import SetupModal from "./components/SetupModal";

function App() {
      return (
            <>
                  <SetupModal isOpen={false} />
                  <CalendarComponent
                        startDate="2025-02-10"
                        endDate="2025-05-10"
                  />
            </>
      );
}

export default App;
