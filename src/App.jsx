import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const getInfo = async () => {
  try {
    const response = await fetch(
      "https://json-api.uz/api/project/job-list/jobs"
    );

    if (!response.ok) {
      throw new Error(`Server xatosi: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("API dan ma’lumot olishda xatolik:", error.message);
    return null; // Agar xato bo‘lsa, null qaytaramiz
  }
};

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(true);
  const [language, setLanguage] = useState("");

  const addData = (a) => {
    setLanguage((p) => {
      if (p.includes(a)) {
        toast.warn("Bunday malumotni avval qo'shgansiz!");
        return p;
      }
      return [...p, a];
    });
  };
  const deleteButton = (id) => {
    setLanguage((prevLanguage) => {
      const deletedItems = prevLanguage.filter((item) => item !== id);
      return deletedItems;
    });
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const data = await getInfo();
      if (data) {
        setJobs(data);
      } else {
        setError("Ma’lumot olishda xatolik yuz berdi!");
      }
      setLoading(false);
    };

    fetchJobs();
  }, [1]);

  if (loading)
    return (
      <div className="text-center mt-60 text-blue-500">⏳ Yuklanmoqda...</div>
    );
  if (error)
    return <div className="text-center mt-60 text-red-500">❌ {error}</div>;
  return (
    <div className="bg-slate-300 h-full">
      <header className="bg-[url('./public/header.png')] bg-cover bg-center h-[156px] w-full">
        {!info ||
          (language.length && (
            <div className="flex items-center gap-2 absolute top-[120px] left-[190px] p-4 border-2 bg-white border-blue-400 rounded-lg w-full max-w-[1110px] posi">
              {language &&
                language.map((so) => {
                  return (
                    <div
                      key={so.so}
                      className="flex items-center gap-2 flex-wrap"
                    >
                      <div className="flex items-center bg-teal-200 text-teal-700 px-3 py-1 rounded-full">
                        {so}
                        <button
                          onClick={() => deleteButton(so)}
                          className="ml-2 bg-teal-700 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-black transition"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              <button
                onClick={() => setInfo(false)}
                className="ml-auto text-blue-600 hover:underline text-sm"
              >
                Clear
              </button>
            </div>
          ))}
      </header>
      <div className="mt-[40px]">
        {" "}
        <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`relative flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-lg ${
                job.featured ? "border-l-4 border-teal-500" : ""
              }`}
            >
              {/* Logo */}
              <img
                src="https://picsum.photos/200/300"
                alt={`${job.company} logo`}
                className="w-16 h-16 rounded-full mr-4"
              />

              {/* Job Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-teal-600 font-semibold">
                  {job.company}
                  {job.new && (
                    <span className="bg-teal-500 text-white px-2 py-1 text-xs rounded-full">
                      NEW!
                    </span>
                  )}
                  {job.featured && (
                    <span className="bg-gray-900 text-white px-2 py-1 text-xs rounded-full">
                      FEATURED
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-gray-900 hover:text-teal-600 cursor-pointer">
                  {job.position}
                </h2>

                <div className="text-gray-500 text-sm mt-2">
                  {job.postedAt} · {job.contract} · {job.location}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                {job.languages &&
                  job.languages.map((til) => {
                    return (
                      <li
                        key={til}
                        onClick={() => addData(til)}
                        className="list-none btn btn-sm"
                      >
                        {til}
                      </li>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

//https://json-api.uz/api/project/job-list/jobs
