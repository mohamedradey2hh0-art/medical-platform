            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: "none" }}
            />

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              style={{ display: "none" }}
            />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "10px",
                marginTop: "12px"
              }}
            >
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={loading}
                style={secondaryButtonStyle}
              >
                <Camera size={18} /> Take Photo
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={loading}
                style={secondaryButtonStyle}
              >
                <ImageIcon size={18} /> Upload Image
              </button>

              <button
                type="submit"
                disabled={loading || (!question.trim() && !selectedImage)}
                style={{
                  marginLeft: "auto",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "13px 22px",
                  cursor: "pointer",
                  opacity:
                    loading || (!question.trim() && !selectedImage)
                      ? 0.6
                      : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {loading ? <Loader2 size={17} /> : <Send size={17} />}
                Ask MedMind
              </button>
            </div>
          </form>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "12px",
              marginTop: "20px",
              lineHeight: 1.5
            }}
          >
            Educational use only. Always verify medical information
            and consult qualified healthcare professionals when needed.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes medmindBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

const fieldStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  border: "1px solid #dbe3ef",
  borderRadius: "10px",
  background: "white",
  fontSize: "15px",
  outline: "none"
};

const secondaryButtonStyle = {
  background: "#eff6ff",
  color: "#1e40af",
  border: "1px solid #bfdbfe",
  borderRadius: "12px",
  padding: "12px 14px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "7px"
};
