export default function UserProfile() {
  return (
    <div className="bg-slate-800 text-white p-6 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-white font-semibold">RS</span>
        </div>
        <div>
          <h3 className="font-medium">Rishika Sharma</h3>
          <p className="text-sm text-slate-400">@rishika2019</p>
        </div>
      </div>
      <div className="mt-4 text-sm text-slate-300">
        <p>B. Tech, Computer Science</p>
        <p>6th Semester, Sharda University</p>
      </div>
    </div>
  );
}
