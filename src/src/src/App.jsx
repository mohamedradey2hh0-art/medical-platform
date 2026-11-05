
                  <div
                    className="dashboard-tool-icon"
                    style={{
                      background: tool.bg,
                      color: tool.color,
                    }}
                  >
                    <Icon size={26} />
                  </div>

                  <div
                    className="dashboard-tool-subtitle"
                    style={{ color: tool.color }}
                  >
                    {tool.subtitle}
                  </div>

                  <h3>
                    {tool.title}
                  </h3>

                  <p>
                    {tool.desc}
                  </p>

                  <span
                    className="dashboard-tool-link"
                    style={{ color: tool.color }}
                  >
                    {tool.id === "health"
                      ? "ابدأ الاستشارة"
                      : tool.id === "cases"
                        ? "ابدأ التدريب"
                        : "استكشف الأداة"
                    }

                    <ChevronLeft size={17} />
                  </span>

                </button>
              );
            })}
          </div>


          {filteredTools.length === 0 && (
            <p className="dashboard-empty">
              لا توجد أدوات مطابقة للبحث.
            </p>
          )}

        </section>


        {selectedTool && (
          <section className="selected-tool-panel">

            <div className="selected-tool-heading">
              <h2>
                {selectedTool.title}
              </h2>

              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="إغلاق"
              >
                <X size={20} />
              </button>
            </div>

            <p>
              {selectedTool.desc}
            </p>

            <p className="development-note">
              هذه الأداة قيد التطوير. سنضيف وظائفها الفعلية في المراحل القادمة.
            </p>

          </section>
        )}


        <section
          id="about"
          className="dashboard-about"
        >
          <GraduationCap
            size={45}
            className="about-graduation-icon"
          />

          <div>
            <h2>
              التعلم والرعاية الصحية بطريقة أذكى
            </h2>

            <p>
              MedMind منصة تهدف إلى مساعدة طلاب الطب على التعلم
              والتدريب، ومساعدة المستخدمين على فهم المعلومات الصحية
              والحصول على التوجيه المناسب.
            </p>
          </div>
        </section>

      </main>


      <footer className="dashboard-footer">
        © 2026 MedMind · Made for learning and better health
      </footer>

    </div>
  );
}
