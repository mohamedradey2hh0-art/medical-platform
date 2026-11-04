                    استكشف الأداة <ChevronLeft size={17} />
                  </span>
                </button>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <p className="dashboard-empty" style={{ textAlign: "center", color: colors.muted }}>
              لا توجد أدوات مطابقة للبحث.
            </p>
          )}
        </section>

        {selectedTool && (
          <section
            className="selected-tool-panel"
            style={{
              marginTop: 30,
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: 18,
              padding: 25,
            }}
          >
            <div
              className="selected-tool-heading"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: 20 }}>{selectedTool.title}</h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="إغلاق"
                style={{
                  border: 0,
                  background: colors.surfaceSoft,
                  color: colors.text,
                  borderRadius: 10,
                  padding: 8,
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ color: colors.muted, lineHeight: 2 }}>{selectedTool.desc}</p>
            <p
              className="development-note"
              style={{
                background: isDark ? "#173536" : "#F0F7F6",
                color: isDark ? "#9DE1D8" : "#087E78",
                borderRadius: 10,
                padding: 13,
                fontSize: 13,
              }}
            >
              هذه الأداة قيد التطوير. سنضيف وظائفها الفعلية في المراحل القادمة.
            </p>
          </section>
        )}

        <section
          id="about"
          className="dashboard-about"
          style={{
            marginTop: 45,
            background: colors.surfaceSoft,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 28,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <GraduationCap size={45} color="#087E78" />
          <div>
            <h2 style={{ margin: "0 0 8px", fontSize: 20 }}>
              التعلم الطبي بطريقة أذكى
            </h2>
            <p style={{ margin: 0, color: colors.muted, lineHeight: 2, fontSize: 14 }}>
              MedMind منصة تعليمية تهدف إلى مساعدة طلاب الطب على الفهم والتدريب والتطور.
            </p>
          </div>
        </section>
      </main>

      <footer
        className="dashboard-footer"
        style={{
          background: isDark ? "#080F1B" : "#102C38",
          color: "white",
          textAlign: "center",
          padding: 25,
          fontSize: 13,
        }}
      >
        © 2026 MedMind · Made for medical students
      </footer>
    </div>
  );
}
