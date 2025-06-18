const App = () => {
    // --- Google Calendar API Configuration ---
    // IMPORTANT: Replace with your own keys from the Google Cloud Console
    const API_KEY = 'YOUR_API_KEY';
    const CLIENT_ID = 'YOUR_CLIENT_ID';
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    const SCOPES = "https://www.googleapis.com/auth/calendar.events";

    // --- State Management ---
    const [studyPlan, setStudyPlan] = React.useState([
        // This data comes directly from your Korean plan
        { date: '6/19', dayOfWeek: '목 (Thu)', dDay: 'D-12', tasks: [{ subject: '사회', description: '인권/헌법/국가기관 인강 수강 + 교재 정독', completed: false }, { subject: '영어', description: '3단원 영영풀이/대화문 암기 시작', completed: false }] },
        { date: '6/20', dayOfWeek: '금 (Fri)', dDay: 'D-11', tasks: [{ subject: '과학', description: '기압과 바람 파트 인강 + 개념 정리', completed: false }, { subject: '역사', description: '고려 통일~통치 체제 인강/정독', completed: false }] },
        { date: '6/21', dayOfWeek: '토 (Sat)', dDay: 'D-10', tasks: [{ subject: '사회', description: '경제 파트 인강 + 문제 풀이', completed: false }, { subject: '과학', description: '운동과 에너지, 에너지 전환 인강 + 문제 풀이', completed: false }, { subject: '복습', description: '사회/과학 1회독 마무리', completed: false }] },
        { date: '6/22', dayOfWeek: '일 (Sun)', dDay: 'D-9', tasks: [{ subject: '국어', description: '음운 체계, 청포도 등 전체 범위 1회독', completed: false }, { subject: '역사', description: '무신정권~신진사대부 인강 및 흐름 정리', completed: false }, { subject: '영어', description: '3,4단원 본문 해석 및 문법 체크', completed: false }] },
        { date: '6/23', dayOfWeek: '월 (Mon)', dDay: 'D-8', tasks: [{ subject: '국어', description: '문제집 풀이 + 오답 정리', completed: false }, { subject: '영어', description: '본문/단어 암기 및 복습', completed: false }] },
        { date: '6/24', dayOfWeek: '화 (Tue)', dDay: 'D-7', tasks: [{ subject: '사회', description: '문제집 풀기 + 오답 노트', completed: false }, { subject: '과학', description: '오답 정리 및 헷갈리는 공식 암기', completed: false }] },
        { date: '6/25', dayOfWeek: '수 (Wed)', dDay: 'D-6', tasks: [{ subject: '과학', description: '문제집 1권 끝내기 + 오답노트', completed: false }, { subject: '역사', description: '문제집 1권 끝내기 + 연표 암기', completed: false }] },
        { date: '6/26', dayOfWeek: '목 (Thu)', dDay: 'D-5', tasks: [{ subject: '국어', description: '문제집 오답 다시 풀기 + 복습', completed: false }, { subject: '영어', description: '최종 단어/본문 암기', completed: false }, { subject: '역사', description: '키워드 암기', completed: false }] },
        { date: '6/27', dayOfWeek: '금 (Fri)', dDay: 'D-4', tasks: [{ subject: '사회', description: '오답노트 복습, 교과서/프린트 최종 정리', completed: false }, { subject: '복습', description: '전 과목 오답노트 훑어보기', completed: false }] },
        { date: '6/28', dayOfWeek: '토 (Sat)', dDay: 'D-3', tasks: [{ subject: '영어', description: '3일차 과목 최종 정리', completed: false }, { subject: '역사', description: '3일차 과목 최종 정리', completed: false }, { subject: '사회', description: '2일차 과목 최종 정리', completed: false }, { subject: '과학', description: '2일차 과목 최종 정리', completed: false }] },
        { date: '6/29', dayOfWeek: '일 (Sun)', dDay: 'D-2', tasks: [{ subject: '사회', description: '2일차 시험과목 최종 복습', completed: false }, { subject: '과학', description: '2일차 시험과목 최종 복습', completed: false }, { subject: '국어', description: '1일차 시험과목 총정리 시작', completed: false }] },
        { date: '6/30', dayOfWeek: '월 (Mon)', dDay: 'D-1', tasks: [{ subject: '국어', description: '내일 볼 과목에 올인!', completed: false }, { subject: '수학', description: '학원 오답노트 최종 복습', completed: false }] },
        { date: '7/1', dayOfWeek: '화 (Tue)', dDay: '시험 1일차', tasks: [{ subject: '국어', description: '시험', completed: true }, { subject: '수학', description: '시험', completed: true }] },
        { date: '7/2', dayOfWeek: '수 (Wed)', dDay: '시험 2일차', tasks: [{ subject: '사회', description: '시험', completed: true }, { subject: '과학', description: '시험', completed: true }] },
        { date: '7/3', dayOfWeek: '목 (Thu)', dDay: '시험 3일차', tasks: [{ subject: '영어', description: '시험', completed: true }, { subject: '역사', description: '시험', completed: true }] },
    ]);
    const [selectedDayIndex, setSelectedDayIndex] = React.useState(0);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    // --- Event Handlers ---
    const handleCheckTask = (taskIndex) => {
        const newStudyPlan = [...studyPlan];
        const dayTasks = [...newStudyPlan[selectedDayIndex].tasks];
        dayTasks[taskIndex].completed = !dayTasks[taskIndex].completed;
        newStudyPlan[selectedDayIndex].tasks = dayTasks;
        setStudyPlan(newStudyPlan);
    };

    // --- Google Calendar Logic ---
    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
            gapi.load('client:auth2', initClient);
        };
        document.body.appendChild(script);
    }, []);

    const initClient = () => {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
        }).then(() => {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            // Handle the initial sign-in state.
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        }, (error) => {
            console.error('Error initializing Google API client:', error);
        });
    };

    const updateSigninStatus = (isSignedIn) => {
        setIsLoggedIn(isSignedIn);
    };

    const handleAuthClick = () => {
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            gapi.auth2.getAuthInstance().signOut();
        } else {
            gapi.auth2.getAuthInstance().signIn();
        }
    };

    const exportToCalendar = () => {
        if (!isLoggedIn) {
            alert("Please sign in with Google first!");
            return;
        }

        const dayData = studyPlan[selectedDayIndex];
        const dateParts = dayData.date.split('/');
        const year = new Date().getFullYear();
        const month = parseInt(dateParts[0], 10) - 1;
        const day = parseInt(dateParts[1], 10);
        
        const batch = gapi.client.newBatch();

        dayData.tasks.forEach((task, index) => {
            // Create 1-hour study blocks starting from 4 PM (16:00)
            const startTime = new Date(year, month, day, 16 + index, 0, 0);
            const endTime = new Date(year, month, day, 16 + index + 1, 0, 0);

            const event = {
                'summary': `[Study] ${task.subject}`,
                'description': task.description,
                'start': {
                    'dateTime': startTime.toISOString(),
                    'timeZone': 'Asia/Seoul'
                },
                'end': {
                    'dateTime': endTime.toISOString(),
                    'timeZone': 'Asia/Seoul'
                },
            };

            const request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event,
            });
            batch.add(request);
        });

        batch.then(() => {
            alert(`Tasks for ${dayData.date} have been exported to your Google Calendar!`);
        }, (error) => {
            console.error("Error exporting to calendar: ", error);
            alert("An error occurred. Check the console for details.");
        });
    };

    const selectedDay = studyPlan[selectedDayIndex];

    return (
        <div className="app-container">
            <div className="timeline-panel">
                <h2>Exam Timeline</h2>
                <ul className="timeline-list">
                    {studyPlan.map((day, index) => (
                        <li 
                            key={index} 
                            className={`timeline-item ${index === selectedDayIndex ? 'active' : ''}`}
                            onClick={() => setSelectedDayIndex(index)}
                        >
                            <span>{day.date} - {day.dayOfWeek}</span>
                            <span className="d-day">{day.dDay}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="daily-plan-panel">
                <div className="plan-header">
                    <h1>{selectedDay.date} Plan</h1>
                    <div>
                        <button onClick={handleAuthClick} className={`gcal-button ${isLoggedIn ? 'signout' : ''}`}>
                            {isLoggedIn ? 'Sign Out' : 'Sign In with Google'}
                        </button>
                        {isLoggedIn && (
                            <button onClick={exportToCalendar} className="gcal-button" style={{marginLeft: '10px'}}>
                                Export Day to Calendar
                            </button>
                        )}
                    </div>
                </div>
                <ul className="task-list">
                    {selectedDay.tasks.map((task, index) => (
                        <li key={index} className="task-item" data-subject={task.subject}>
                            <input 
                                type="checkbox" 
                                className="task-checkbox" 
                                checked={task.completed}
                                onChange={() => handleCheckTask(index)}
                            />
                            <div className={`task-details ${task.completed ? 'completed' : ''}`}>
                                <div className="task-subject">{task.subject}</div>
                                <div>{task.description}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));