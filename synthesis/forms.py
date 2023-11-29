from django import forms


class InputForm(forms.Form):
    VOICE_OPTIONS = [
        ("1051", "1051"), ("6208 (sdp)", "6208 (sdp)"), ("6446-MagK (sdp)", "6446-MagK (sdp)"), ("6450 (sdp)", "6450 (sdp)"), ("A11", "A11"), ("A12", "A12"), ("A13", "A13"), ("A14", "A14"), ("A19", "A19"), ("A2", "A2"), ("A22", "A22"), ("A23", "A23"), ("A32", "A32"), ("A33", "A33"), ("A34", "A34"), ("A35", "A35"), ("A36", "A36"), ("A4", "A4"), ("A5", "A5"), ("A6", "A6"), ("A7", "A7"), ("A8", "A8"), ("A9", "A9"), ("B11", "B11"), ("B12", "B12"), ("B15", "B15"), ("B2", "B2"), ("B21", "B21"), ("B22", "B22"), ("B31", "B31"), ("B32", "B32"), ("B33", "B33"), ("B34", "B34"), ("B4", "B4"), ("B6", "B6"), ("B7", "B7"), ("B8", "B8"), ("C12", "C12"), ("C13", "C13"), ("C14", "C14"), ("C17", "C17"), ("C18", "C18"), ("C19", "C19"), ("C2", "C2"), ("C20", "C20"), ("C21", "C21"), ("C22", "C22"), ("C23", "C23"), ("C31", "C31"), ("C32", "C32"), ("C4", "C4"), ("C6", "C6"), ("C7", "C7"), ("C8", "C8"), ("D11", "D11"), ("D12", "D12"), ("D13", "D13"), ("D21", "D21"), ("D31", "D31"), ("D32", "D32"), ("D4", "D4"), ("D6", "D6"), ("D7", "D7"), ("D8", "D8"), ("Linda Johnson", "Linda Johnson"),
    ]

    SENTENCE_OPTIONS = [
        (1, "Sentence 1"),
    ]

    project_name = forms.CharField(
        max_length=254,
        min_length=3,
        widget=forms.TextInput(
            attrs={
                "id": "project-name-field",
                "placeholder": "Example synthesis",
                "class": "form-control form-control-lg",
                "style": "width: 250px; border-color: #212529; border: none; outline: 0;",
                "aria-label": "Project name",
            }
        ),
        initial="Example synthesis",
    )

    text_input = forms.CharField(
        max_length=500,
        required=False,
        widget=forms.Textarea(
            attrs={
                "id": "text-input-field",
                "class": "form-control mb-1",
                "style": "height: 550px; font-family: Andale Mono, monospace; border-color: #212529; border-radius: 0px;",
            }
        ),
        label="Text:",
    )

    ipa_input = forms.CharField(
        max_length=500,
        min_length=1,
        widget=forms.Textarea(
            attrs={
                "id": "ipa-input-field",
                "class": "form-control mb-1",
                "style": "height: 550px; font-family: Andale Mono, monospace; border-color: #212529; border-radius: 0px;",
            }
        ),
    )

    voice = forms.ChoiceField(
        choices=VOICE_OPTIONS,
        initial=VOICE_OPTIONS[0],
        widget=forms.Select(
            attrs={
                "id": "voice-select-field",
                "class": "form-select",
                "style": "margin-right: 3rem; margin-bottom: 1rem; border-color: #212529; border-radius: 0px;",
            }
        ),
    )

    sentence = forms.ChoiceField(
        choices=SENTENCE_OPTIONS,
        initial=SENTENCE_OPTIONS[0],
        widget=forms.Select(
            attrs={
                "id": "sentence-select-field",
                "class": "form-select",
                "style": "margin-right: 3rem; margin-bottom: 1rem; border-color: #212529; border-radius: 0px;",
            }
        ),
    )

    def clean_project_name(self):
        """
        Substitutes all characters that aren't a letter with an underscore.
        """
        project_name = self.cleaned_data["project_name"]
        cleaned_project_name = "".join(c if c.isalpha() else "_" for c in project_name)
        return cleaned_project_name

    def clean_text_input(self):
        """
        Discards all text input by subtituting it with an empty string.
        """
        return ""