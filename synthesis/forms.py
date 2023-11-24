from django import forms


class InputForm(forms.Form):
    VOICE_OPTIONS = [
        ("Linda Johnson", "Linda Johnson"),
        ("6208 (sdp)", "6208 (sdp)"),
        ("6446-MagK (sdp)", "6446-MagK (sdp)"),
        ("6450 (sdp)", "6450 (sdp)"),
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